# MESSerialNumberAPI - API Documentation

## Overview: 
The primary purpose of MESSerialNumberAPI deal with input serial data list by validing the data format, then update or insert every single input serial data in database, then output the result to user, returning the data to frontend side. <br/>

## Function format
### example input:

```json
{
    "serialDataList":[
        {"SerialNo":"your serial no","PartNo":"your part no","InspectionData":"","PropertyData":"","ModifyUser":"Vitas","Message":null,"CheckCode":0,"CtrlCode":0}
    ]
}
```

- SerialNo <string>: primary key of serial data, if SerialNo not exist, the data will go to insert; other wise it will go to update.<br/>
- PartNo <string>: primary key of vPartMast, if PartNo not exist, the data will go to incorrect data.<br/>
- InspectionData <string>: Should be in Json string, and has the corresponding format down below, if the format are incorrect, the data will go to incorrect data<br/>
- PropertyData <string>: Should be in Json string, if the format are incorrect, the data will go to incorrect data
- ModifyUser <string>: The user who modify the record.<br/>
- Message <string>: Some note or error message can be saved here.<br/>
- CheckCode <int>: On backend side, if checkCode = 1, then we should change CtrlCode, else if checkCode = 0, we should not change CtrlCode.<br/>
- CtrlCode <int>: 是否合格, true = 1; false = 0;<br/>


inspection data format in excel (excel file should be .csv): <br/>
序號, 客戶料號, 檢驗結果, 檢驗數據<br/>
ABCD001, 241-000-11, 1, {“電壓”：”247”, “轉數”：”30”, “電流”：”15”}<br/>
ABCD002, 241-000-21, 1, {“電壓”：”257”, “轉數”：”30”, “電流”：”15”}<br/>

### example output:
```json
{
    "InsertSuccess": [],
    "InsertFailed": [],
    "UpdateSuccess": [
        {
            "SerialNo": "your serial no",
            "PartNo": "your part no",
            "CheckCode": 0,
            "CtrlCode": 0,
            "InspectionData": "",
            "PropertyData": "",
            "ModifyUser": "Vitas",
            "Message": "Update serial data successful"
        }
    ],
    "UpdateFailed": [],
    "IncorrectData": []
}
```

- InsertSuccess	新增成功的Serial Data list<br/>
- InsertFailed	新增失敗的Serial Data list(於寫入DB時失敗)<br/>
- UpdateSuccess	修改成功的Serial Data list<br/>
- UpdateFailed	修改失敗的Serial Data list(於寫入DB時失敗)<br/>
- IncorrectData	資料格式異常(input Serial Data任意欄位格式異常/ vPartMast缺少對應PartNo)<br/>

