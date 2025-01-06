using MESSerialNumberAPI.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace MESSerialNumberAPI.Services
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

        public static string GetSctlMastNo(string value)
        {
            string result = string.Empty;

            // Enqueue the task
            QueueProcessor.Enqueue(() =>
            {
                int no = 0;
                using (var MESSNDBEntities = new MESSNDBEntities())
                {
                    var sctlMast = MESSNDBEntities.SctlMast.ToList();
                    var query = sctlMast.Where(p => p.ScrmKey == value);

                    foreach (var p in query)
                    {
                        no = Convert.ToInt32(p.LastNo + 1);
                        p.LastNo = no;
                    }
                    MESSNDBEntities.SaveChanges();

                    // Check the cache to make sure the number is unique
                    lock (lockObj)
                    {
                        // Return the result
                        result = no.ToString();
                    }
                }
            });

            while (result == string.Empty)
            {
                Thread.Sleep(timeSleep);
            }
            return result;
        }

    }
}
