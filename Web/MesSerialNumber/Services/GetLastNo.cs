using MesSerialNumber.Constant;
using MesSerialNumber.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace MesSerialNumber.Services
{
    public class GetLastNo
    {
        static int timeSleep = 500;
        public static object lockObj = new object();

        public class QueueProcessor
        {
            private static BlockingCollection<Action> queue = new BlockingCollection<Action>();
            private static ManualResetEvent resetEvent = new ManualResetEvent(false);

            static QueueProcessor()
            {
                Task.Run(() =>
                {
                    while (true)
                    {
                        resetEvent.WaitOne();
                        Action action;
                        while (queue.TryTake(out action))
                        {
                            action();
                        }

                        resetEvent.Reset();
                    }
                });
            }

            public static void Enqueue(Action action)
            {
                queue.Add(action);
                resetEvent.Set();
            }

            public static void Complete()
            {
                queue.CompleteAdding();
            }
        }

        public static int GetSctlMastNo(string value)
        {
            int result = 0;

            // Enqueue the task
            QueueProcessor.Enqueue(() =>
            {
                int no = 0;
                using (var dataService = new MESSNDBEntities())
                {
                    List<SctlMast> sctlMast = dataService.SctlMast.ToList();
                    var query = sctlMast.Where(p => p.ScrmKey == value);
                
                    foreach (var p in query)
                    {
                        no = Convert.ToInt32(p.LastNo + 1);
                        p.LastNo = no;
                    }
                    dataService.SaveChanges();

                    // Check the cache to make sure the number is unique
                    lock (lockObj)
                    {
                        // Return the result
                        result = no;
                    }
                }
            });

            while (result == 0)
            {
                Thread.Sleep(timeSleep);
            }
            return result;
        }

        public static string GetSctlMastDesc(string value)
        {
            string result = String.Empty;
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                result = MESSNDBEntities.SctlMast.Where(p => p.ScrmKey == value).Select(p => p.ScrmDesc).FirstOrDefault();
            }
            return result;
        }
    }
}