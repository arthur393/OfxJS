var header, transaction="", footer;

var serverDate  = "";
var bankId      = "";
var bankName    = "";
var bankAccount = "";
var startDate   = "";
var endDate     = "";
var balance     = "";


// Fill array with your data
// Note: In this case i use PegJs to parser csv to array format
var array = [
     [
        "", /*Date*/
        "", /*Memo*/
        "", /*Doc ID*/
        ""  /*Amount*/
     ]
]   

 header = "OFXHEADER:100\n"  +
            "DATA:OFXSGML\n" +
            "VERSION:102\n" +
            "SECURITY:NONE\n" +
            "ENCODING:USASCII\n" +
            "CHARSET:1252\n" +
            "COMPRESSION:NONE\n" +
            "OLDFILEUID:NONE\n" +
            "NEWFILEUID:NONE\n" +
            "\n" +
            "<OFX>\n" +
                "\t<SIGNONMSGSRSV1>\n" +
                    "\t\t<SONRS>\n" +
                        "\t\t\t<STATUS>\n" +
                            "\t\t\t\t<CODE>0\n" +
                            "\t\t\t\t<SEVERITY>INFO\n" +
                        "\t\t\t</STATUS>\n"+
                        "\t\t\t<DTSERVER>"+ serverDate +"[-3:GMT]\n"+
                        "\t\t\t<LANGUAGE>ENG\n"+
                        "\t\t\t<FI>\n"+
                            "\t\t\t\t<ORG>"+ bankName +"\n"+
                            "\t\t\t\t<FID>"+ bankName +"\n"+
                        "\t\t\t</FI>\n"+
                    "\t\t</SONRS>\n"+
                "\t</SIGNONMSGSRSV1>\n"+
                "<BANKMSGSRSV1>\n"+
                    "<STMTTRNRS>\n"+
                        "<TRNUID>1\n"+
                        "<STATUS>\n"+
                            "<CODE>0\n"+
                            "<SEVERITY>INFO\n"+
                        "</STATUS>\n"+
                        "<STMTRS>\n"+
                            "<CURDEF>BRC\n"+
                            "<BANKACCTFROM>\n"+
                                "<BANKID>" + bankId + "\n"+
                                "<ACCTID>" + bankAccount + "\n"+
                                "<ACCTTYPE>CHECKING\n"+
                            "</BANKACCTFROM>\n"+
                            "<BANKTRANLIST>\n"+
                                "<DTSTART>" + startDate + "[-3:GMT]\n"+
                                "<DTEND>"   + endDate   + "[-3:GMT]\n";

// Transactions Iterador according to the array
for (var i = 0 ; i < array.length; i++) 
{
   transaction += "<STMTTRN>\n" +
                        "\t<TRNTYPE>OTHER\n" +
                        "\t<DTPOSTED> "  + strToGMT(array[i][0]) + "[-3:GMT]\n" +
                        "\t<TRNAMT> "    + array[i][3] + "\n" +
                        "\t<FITID>"      + array[i][2] + "\n" +
                        "\t<CHECKNUM>"   + array[i][2] + "\n" +
                        "\t<PAYEEID>0\n" +
                        "\t<MEMO>"       + array[i][1] + "\n" +
                    "</STMTTRN>\n";
};


footer = "</BANKTRANLIST>" +
            "<LEDGERBAL>\n" +
                    "\t<BALAMT>" + balance +"\n"+
                    "\t<DTASOF> "+ serverDate +"[-3:GMT]\n"+
                "</LEDGERBAL>\n" +
            "</STMTRS>\n"+
        "</STMTTRNRS>\n"+
    "</BANKMSGSRSV1>\n"+
    "</OFX>";


console.log(header);
console.log(transaction);
console.log(footer);


/* Format date                     */
/* Receives string -> "dd/mm/yyyy" */
/* Return string -> yyyymmdd000000 */
function strToGMT(date)
{

   var dateR = date.replace(/[TZ`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

   var day   = dateR.substring(dateR.length-6,0);
   var month = dateR.substring(dateR.length-6,4);
   var year  = dateR.substring(dateR.length,4)

	return year+month+day+"000000";
}