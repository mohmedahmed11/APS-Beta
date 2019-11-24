const { app, BrowserWindow, ipcRenderer } = require('electron')
const $ = require('jquery')
const basics = require('./basics')
const jsPDF = require('jspdf');

ipcRenderer.on('store-data', (e, data, title) => {
    SettDataToView(data);
})

function SettDataToView(data) {

    let item = data[0]

    $("#title-view").text(item.narration)
    $("#title-view-date").text(item.date)
    $("#title-view-id").text("#"+item.id)

    let details = item.enteries_details

    details.forEach(item => {
        let itemView = document.createElement('a')
        let ledger = item.ledgers
        let currency = item.currencies
        // itemView.setAttribute('class', 'list-group-item list-group-item-action listItemsCotroller') 
        
        itemView.setAttribute('style', 'position:relative; display:block; padding:.75rem 1.25rem; margin-bottom:-1px; backgroundColor:#fff; border:1px solid rgba(0,0,0,.125); text-align:inherit; border-bottom: 0; border-right: 0;  border-left: 0;' )
    
        
        // itemView.css("position", "relative");
        // itemView.css("display", "block");
        // itemView.css("padding", ".75rem 1.25rem");
        // itemView.css("margin-bottom", "-1px");
        // itemView.css("backgroundColor", "#fff");
        // itemView.css("border", "1px solid rgba(0,0,0,.125)");
        // itemView.css("text-align", "inherit");
        // itemView.css("width", "100%");



        itemView.innerHTML = '<div  style = "width: 100%!important; justify-content: space-between!important; display: flex!important;">'
        +'<h6  style="width: 40%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+ledger.name+'</h6>'
        +'<h6  style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.debit+'</h6>'
        +'<h6  style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.credit+'</h6>'
        +'<h6  style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+currency.code+'</h6>'
        +'<h6  style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.currencies_rate+'</h6>'
        +'<h6  style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.debit+'</h6>'
        +'<h6  style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.credit+'</h6>'
        +'</div>'
    
        $("#MainList").append(itemView)
    });

    let itemView = document.createElement('a')

    // itemView.css("position", "relative");
    // itemView.css("display", "block");
    // itemView.css("padding", ".75rem 1.25rem");
    // itemView.css("margin-bottom", "-1px");
    // itemView.css("backgroundColor", "#fff");
    // itemView.css("border", "1px solid rgba(0,0,0,.125)");
    // itemView.css("text-align", "inherit");
    // itemView.css("width", "100%");
    itemView.setAttribute('style', 'position:relative; display:block; padding:.75rem 1.25rem; margin-bottom:-1px; backgroundColor:#fff; border:1px solid rgba(0,0,0,.125); text-align:inherit; border-bottom: 0; border-right: 0;  border-left: 0;' )
    
    itemView.innerHTML = '<div style = "width: 100%!important; justify-content: space-between!important; display: flex!important;">'
    +'<h6 class="mb-1" style="width: 40%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;"> total </h6>'
    +'<h6 class="mb-1" style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.total_Dr+'</h6>'
    +'<h6 class="mb-1" style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.total_Cr+'</h6>'
    +'<h6 class="mb-1" style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;"> </h6>'
    +'<h6 class="mb-1" style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;"> </h6>'
    +'<h6 class="mb-1" style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.total_Dr+'</h6>'
    +'<h6 class="mb-1" style="width: 10%; margin-bottom: .25rem!important; font-size: 1rem; font-weight: 500; line-height: 1.2; margin-top: 0; box-sizing: border-box;">'+item.total_Cr+'</h6>'
    +'</div>'
  
    $("#MainList").append(itemView)

    
}


var doc = new jsPDF();
var specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
};

$('#print-pdf').click(function () {

    // var printme = document.getElementById('Content-to-print');
    var printme = document.getElementById('Content-to-print');
    var wme = window
    // wme.open("","","width=900,height=700,border=1");
    wme.document.write(printme.outerHTML);
    wme.document.close();
    wme.focus();
    wme.print();
    // wme.close();
    //window.print();

    // doc.fromHTML($('#Content-to-print').html(), 15, 15, {
    //     'width': 170,
    //         'elementHandlers': specialElementHandlers
    // });
    // doc.save('sample-file.pdf');
});
