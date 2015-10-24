/*
  http://pegjs.org/online
  
  {
    var separator = ';';
  }

  start
    = comma

  comma
    = & { return separator = ';'; } sv:sv { return sv; }

  tab
    = & { return separator = '\t'; } sv:sv { return sv; }

  sv
    = [\n\r]* first:line rest:([\n\r]+ data:line { return data; })* [\n\r]* { rest.unshift(first); return rest; }

  line
    = first:field rest:(char:. & { return char == separator; } text:field { return text; })*
      & { return !!first || rest.length; }
      { rest.unshift(first); return rest; }

  field
    = '"' text:char* '"' { return text.join(''); }
    / text:(char:[^\n\r] & { return char != separator; } { return char; })*
      { return text.join(''); }

  char
    = '"' '"' { return '"'; }
    / [^"]

*/

var header;
var transaction = "";
var footer;

var serverDate  = "";
var bankId      = "";
var bankName    = "";
var bankAccount = "";
var startDate   = "";
var endDate     = "";
var balance     = "";


// Fill array with your data
// Note: In this case I have used PegJS to parser csv to array format
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
            "CHARSET:1252\n" +header = "OFXHEADER:100\n"  +
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
                        "\t\t\t<DTSERVER>"+ strToGMT(serverDate) +"[-3:GMT]\n"+
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
                        "<DTSTART>" + strToGMT(startDate) + "[-3:GMT]\n"+
                        "<DTEND>"   + strToGMT(endDate)   + "[-3:GMT]\n";

for (var i = 0 ; i < array.length; i++) 
{
   transaction += "<STMTTRN>\n" +
                        "\t<TRNTYPE>OTHER\n" +
                        "\t<DTPOSTED> "  + strToGMT(array[i][0])   + "[-3:GMT]\n" +
                        "\t<TRNAMT> "    + strToMoney(array[i][3]) + "\n"         +
                        "\t<FITID>"      + array[i][2] + "\n"      +
                        "\t<CHECKNUM>"   + array[i][2] + "\n"      +
                        "\t<PAYEEID>0\n" +     
                        "\t<MEMO>"       + array[i][1] + "\n"      +
                    "</STMTTRN>\n";
};


footer  = "</BANKTRANLIST>" +
              "<LEDGERBAL>\n" +
                      "\t<BALAMT>" + balance +"\n"+
                      "\t<DTASOF> "+ strToGMT(serverDate) +"[-3:GMT]\n"+
                  "</LEDGERBAL>\n" +
              "</STMTRS>\n"+
          "</STMTTRNRS>\n"+
      "</BANKMSGSRSV1>\n"+
      "</OFX>";


document.write("<center><h2> Parser CSV to OFX Format <br />By Arthur Henrique</h2></center>");

console.log(

            header      + "\n" +   
            transaction + "\n" + 
            footer

            );

/* Format money                    */
/* Receives string -> "100.000,00" */
/* Return string -> 100000,00      */
function strToMoney(money)
{
  return money.replace(/[./]/, '');
}


/* Format European date            */
/* Receives string -> "dd/mm/yyyy" */
/* Return string -> yyyymmdd000000 */
function strToGMT(date)
{
   var dateR = date.replace(/[/]/gi, '');

   var day   = dateR.substring(dateR.length-6,0);
   var month = dateR.substring(dateR.length-6,4);
   var year  = dateR.substring(dateR.length,4)

  return year+month+day+"000000";
}

/* Receives string -> file name */
/* Receives string -> text      */
/* Return a file                */
function download(filename, text) {

    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

/* Void */
/* Call a download */
function callDownload()
{
  var filename = bankName + " " + serverDate  + ".ofx" ;

  var text     = header      + "\n" + 
                 transaction + "\n" + 
                 footer;

  download(filename, text);

}
            
