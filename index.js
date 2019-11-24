'use strict'

const { app, BrowserWindow, ipcRenderer } = require('electron')
const $ = require('jquery')
const basics = require('./basics')
const item_cell = require("./item-cell")
const currency = require("./currency-cell")
const axios = require('axios')


var items


var ledgers,currencys

var newEntryItems = Array()

$(document).ready( function() {

  setEvents('#Primary-window', 'primary.html', 'Primarys', 'primary/')
  setEvents('#SubPrimary-window', 'subPrimarys.html', 'Sub Primary', 'subPrimary/', true, 'primary/')
  setEvents('#Groups-window', 'groups.html', 'Groups', 'group/', true, 'subPrimary/')
  setEvents('#SubGroups-window', 'subGroups.html', 'Sub Groups', 'subGroup/', true, 'group/')
  setEvents('#Ledgers-window', 'ledgers.html', 'Ledgers', 'ledger/', true, 'subGroup/')
  setEventsCurrency('#Currency-window', 'currency.html', 'Currency', 'currency/')
  setEventsEntrys('#Entrys-window', 'entryes.html', 'Entrys', 'entery/')

  setEntryReportPage('#EntryReport', 'entryReport.html', 'Entry Report', 'enteries/')

  $('#calceleMondel').on('click', function() {
    canceleModel()
  });

});

function canceleModel() {
  $("#subWindows").slideUp()
  $("#subWindowsContent").contents("")
}

function setEntryReportPage(btnId, fileUrl, title, url) {
  $(btnId).on("click", function() {
    // $("#subWindows").load('template/primary.html'); 
    $("#subWindows").slideDown()
    $("#subWindowsContent").load(fileUrl, function() {
      
      $("#subWindows .card-header").text(title)
      // setupViews()
      submitDataForGetEntryById(url, '#myForm' ,$('#entryIdForSearch').val())
      
      // loadData(url)

      
      

      // if (hasMain) {
      //   loadMainData(mainUrl)
      // }

    });
  });
}

function submitDataForGetEntryById(url, formId, id) {
  $(formId).on('submit', function() {
    // console.log( basics.baseUrl+url+id);
    axios({
        method: 'get',
        url: basics.baseUrl+url+$('#entryIdForSearch').val(),//basics.baseUrl+'primary',
        data: $( this ).serialize(),

    }).then(function (response) {
        // handle success
        let data = response.data
        $(formId)[0].reset()
        if (data.error == true ){
          alert(data.message)
        }else if (data.error == false ){
          // loadData(url)
          ipcRenderer.send('open-pdf-window', data.data) 
         
          
        }
        
    })

    return false
  });
}

let winReportPDF

function createReportPDFWindow () {
  // Create the browser window.
  // winReportPDF = new BrowserWindow({
  //   width: 1200,
  //   height: 800,
  //   webPreferences: {
  //     nodeIntegration: true
  //   }
  // })

  // // and load the index.html of the app.
  // winReportPDF.loadFile('template/index.html')

  // // Open the DevTools.
  // winReportPDF.webContents.openDevTools()


  // // Emitted when the window is closed.
  // winReportPDF.on('closed', () => {
  //   // Dereference the window object, usually you would store windows
  //   // in an array if your app supports multi windows, this is the time
  //   // when you should delete the corresponding element.
  //   winReportPDF = null
  // })


  
}

function setEvents(btnId, fileUrl, title, url, hasMain = false, mainUrl = '') {
  
  $(btnId).on("click", function() {
    // $("#subWindows").load('template/primary.html'); 
    $("#subWindows").slideDown()
    $("#subWindowsContent").load(fileUrl, function() {
      
      $("#subWindows .card-header").text(title)
      // setupViews()
      submitData(url, '#myForm', $('#actionType'), $('#editId'))
      
      loadData(url)

      if (hasMain) {
        loadMainData(mainUrl)
      }

    });
  });

}

function setEventsCurrency(btnId, fileUrl, title, url) {
  
  $(btnId).on("click", function() {
    // $("#subWindows").load('template/primary.html'); 
    $("#subWindows").slideDown()
    $("#subWindowsContent").load(fileUrl, function() {
      
      $("#subWindows .card-header").text(title)
      // setupViews()
      submitDataCurrency(url, '#myForm', $('#actionType'), $('#editId'))
      
      loadDataCurrency(url)

    });
  });

}

function setEventsEntrys(btnId, fileUrl, title, url) {
  
  $(btnId).on("click", function() {
    // $("#subWindows").load('template/primary.html'); 
    $("#subWindows").slideDown()
    $("#subWindowsContent").load(fileUrl, function() {
      
      $("#subWindows .card-header.top").text(title)
      // setupViews()
      submitDataEntrys(url, '#myForm', $('#actionType'), $('#editId'))
      
      loadDataEntrysAssist('currency/', '#currencyList')
      loadDataEntrysAssist('ledger/', '#ledgerList')
      // loadDataEntrysCurrency()
      setNewEntryItemsList()
      addNewEnteysItem()

    });
  });

}


function setUpActions(url, bttonClass, action) {
  if ( action == 'delete' ){
    $(bttonClass).on('click', function() {
      if (confirm('Are you sure you want to delete this thing from the database?')) {
        confirmDelete(url ,$(this))
      } else {
          return
      }
      
      // 
    })
  }else if ( action == 'edit' ) {
    $(bttonClass).on('click', function() {
      if (confirm('Are you sure you want to update this thing into the database?')) {
        // submitData(basics.baseUrl+'primary/'+$(this).attr('val'), '#myForm', 'put')
        let id =  $(this).attr('val')
        let data = items.data

        let object = data[id]

        $('#myForm #inputName').val(object.name)
        $('#myForm #actionType').val('put')
        $('#myForm #editId').val(object.id)

      } else {
          return
      }
    })
  }
  
}


function setUpActionsCurrency(url, bttonClass, action) {
  if ( action == 'delete' ){
    $(bttonClass).on('click', function() {
      if (confirm('Are you sure you want to delete this thing from the database?')) {
        confirmDeleteCurrency(url ,$(this))
      } else {
          return
      }
      
      // 
    })
  }else if ( action == 'edit' ) {
    $(bttonClass).on('click', function() {
      if (confirm('Are you sure you want to update this thing into the database?')) {
        // submitData(basics.baseUrl+'primary/'+$(this).attr('val'), '#myForm', 'put')
        let id =  $(this).attr('val')
        let data = items.data

        let object = data[id]

        $('#myForm #inputCode').val(object.code)
        $('#myForm #inputRate').val(object.rate)
        $('#myForm #actionType').val('put')
        $('#myForm #editId').val(object.id)

      } else {
          return
      }
    })
  }
  
}

function setUpActionsEntrys(url, bttonClass, action) {
  if ( action == 'delete' ){
    $(bttonClass).on('click', function() {
      if (confirm('Are you sure you want to delete this thing from the database?')) {
        confirmDeleteEntrys(url ,$(this))
      } else {
          return
      }
      
      // 
    })
  }else if ( action == 'edit' ) {
    $(bttonClass).on('click', function() {
      if (confirm('Are you sure you want to update this thing into the database?')) {
        // submitData(basics.baseUrl+'primary/'+$(this).attr('val'), '#myForm', 'put')
        let id =  $(this).attr('val')
        let data = items.data

        let object = data[id]

        $('#myForm #inputCode').val(object.code)
        $('#myForm #inputRate').val(object.rate)
        $('#myForm #actionType').val('put')
        $('#myForm #editId').val(object.id)

      } else {
          return
      }
    })
  }
  
}


function confirmDelete(url ,object) {
  deleteItem(url,object.attr('val'))
}

function confirmDeleteCurrency(url ,object) {
  deleteItemCurrency(url,object.attr('val'))
}

function confirmDeleteEntrys(url ,object) {
  deleteItemEntrys(url,object.attr('val'))
}

function loadData(url) {

    let itemsViews = $('#MainList')
    
    axios.get(basics.baseUrl+url)
    .then(function (response) {
        // handle success
      itemsViews.html("")
      
      items = response.data

      let data = items.data
      let x = 0
      data.forEach(item => {
        itemsViews.append(item_cell.addItem(item, x++))
      });
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
      
      setUpActions(url,'.editItemNow', 'edit')
      setUpActions(url,'.deleteItemNow', 'delete')

    })

    console.log('Upload successful!  Server responded with:');
}

function loadDataCurrency(url) {

  let itemsViews = $('#MainList')
  
  axios.get(basics.baseUrl+url)
  .then(function (response) {
      // handle success
    itemsViews.html("")
    
    items = response.data

    let data = items.data
    let x = 0
    data.forEach(item => {
      itemsViews.append(currency.addItem(item, x++))
    });

  })
  .catch(function (error) {
      // handle error
      console.log(error);
  })
  .finally(function () {
    
    setUpActionsCurrency(url,'.editItemNow', 'edit')
    setUpActionsCurrency(url,'.deleteItemNow', 'delete')

  })

  console.log('Upload successful!  Server responded with:');
}

function loadDataEntrys(url) {

  let itemsViews = $('#MainList')
  
  axios.get(basics.baseUrl+url)
  .then(function (response) {
      // handle success
    itemsViews.html("")
    
    items = response.data

    let data = items.data
    let x = 0
    data.forEach(item => {
      itemsViews.append(item_cell.addItem(item, x++))
    });
  })
  .catch(function (error) {
      // handle error
      console.log(error);
  })
  .finally(function () {
    
    setUpActionsEntrys(url,'.editItemNow', 'edit')
    setUpActionsEntrys(url,'.deleteItemNow', 'delete')

  })

  console.log('Upload successful!  Server responded with:');
}

function loadMainData(url) {

  let itemsViews = $('#MainSelects')
  
  axios.get(basics.baseUrl+url)
  .then(function (response) {
      // handle success
    itemsViews.html("")
    
    let items = response.data

    let data = items.data
    let x = 0
    data.forEach(item => {
      let value = '<option value="'+item.id+'">'+item.name+'</option>' 
      itemsViews.append(value)
    });

  })
  .catch(function (error) {
      // handle error
      console.log(error);
  })
  .finally(function () {
    
    // setUpActions('.editItemNow', 'edit')
    // setUpActions('.deleteItemNow', 'delete')

  })

  console.log('Upload successful!  Server responded with:');
}

function loadDataEntrysAssist(url, listId) {

  let itemsViews = $(listId)
  
  axios.get(basics.baseUrl+url)
  .then(function (response) {
      // handle success
    itemsViews.html("")
    
    let items = response.data

    let data = items.data
    if ( listId == '#currencyList' ) {
      currencys = data
    }else {
      ledgers = data
    }
    let x = 0
    data.forEach(item => {
      if ( listId == '#currencyList' ) {
        let value = '<option value="'+x+'">'+item.code+'</option>' 
        itemsViews.append(value)
      }else {
        let value = '<option value="'+x+'">'+item.name+'</option>' 
        itemsViews.append(value)
      }
      x++;
    });

  })
  .catch(function (error) {
      // handle error
      console.log(error);
  })
  .finally(function () {
    // console.log(listId);
    // setUpActions('.editItemNow', 'edit')
    // setUpActions('.deleteItemNow', 'delete')

  })

  console.log('Upload successful!  Server responded with:');
}

function submitData(url, formId, method, editId) {
  $(formId).on('submit', function() {

    axios({
        method: method.val(), //'post',
        url: basics.baseUrl+url+editId.val(),//basics.baseUrl+'primary',
        data: $( this ).serialize(),

    }).then(function (response) {
        // handle success
        let data = response.data
        $(formId)[0].reset()
        method.val('post')
        editId.val('')

        if (data.error == true ){
          alert(data.message)
        }else if (data.error == false ){
          loadData(url)
        }
        
    })

    return false
  });
}

function submitDataCurrency(url, formId, method, editId) {
  $(formId).on('submit', function() {

    axios({
        method: method.val(), //'post',
        url: basics.baseUrl+url+editId.val(),//basics.baseUrl+'primary',
        data: $( this ).serialize(),

    }).then(function (response) {
        // handle success
        let data = response.data
        $(formId)[0].reset()
        method.val('post')
        editId.val('')

        if (data.error == true ){
          alert(data.message)
        }else if (data.error == false ){
          loadDataCurrency(url)
        }
      
    })

    return false
  });
}

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name]) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};

function submitDataEntrys(url, formId, method, editId) {
  $(formId).on('submit', function() {
    // var form = document.getElementById(formId);// or document.getElementById('my_form_id');
    // var formdata = new FormData($( this ));
    let data = $(this).serializeObject();
    data["details"] = newEntryItems
    data['total_Dr'] = $('#TotalDebit').val()
    data['total_Cr'] = $('#TotalCredit').val()
    console.log(data);
    
    // return false
    axios({
        method: method.val(), //'post',
        url: basics.baseUrl+url+editId.val(),//basics.baseUrl+'primary',
        data: data,
    }).then(function (response) {
        // handle success
        console.log(response);
        let data = response.data
        $(formId)[0].reset()
        method.val('post')
        editId.val('')
        if (data.error == true ){
          alert(data.message)
          newEntryItems = Array()
        }else if (data.error == false ){
          alert(data.message)
          canceleModel()
        }
    })
    return false
  });
}

function deleteItem(url, id) {

  axios({
      method: 'delete', //'post',
      url: basics.baseUrl+url+id,//basics.baseUrl+'primary',\
  }).then(function (response) {
      // handle success
      let data = response.data
      if (data.error == true ){
        alert(data.message)
      }else if (data.error == false ){
        loadData(url)
      }
      
  })
}


function deleteItemCurrency(url, id) {

  axios({
      method: 'delete', //'post',
      url: basics.baseUrl+url+id,//basics.baseUrl+'primary',\
  }).then(function (response) {
      // handle success
      let data = response.data
      if (data.error == true ){
        alert(data.message)
      }else if (data.error == false ){
        loadDataCurrency(url)
      }
      
  })
}


function deleteItemEntrys(url, id) {

  axios({
      method: 'delete', //'post',
      url: basics.baseUrl+url+id,//basics.baseUrl+'primary',\

  }).then(function (response) {
      // handle success
      let data = response.data

      if (data.error == true ){
        alert(data.message)
      }else if (data.error == false ){
        loadDataEntrys(url)
      }
      
  })
}

function setNewEntryItemsList() {
  let newEntryItemsView = $('#newEntryItemsView')
  newEntryItemsView.html("")

  let totalDebit = 0
  let totalCredit = 0

  let header = '<a href="#" class="list-group-item list-group-item-action ">'
    +'<div class="d-flex w-100 justify-content-between">'
        +'<p style="width: 30%; text-align: left;"> Ledger </p>'
        +'<p style="width: 15%;"> Debit </p> '
        +'<p style="width: 15%;"> Credit </p> '
        +'<p style="width: 30%;"> Currency </p>'
        +'<p style="width: 10%;"> ... </p>'
      +'</div>'
    +'</a>'
    newEntryItemsView.append(header)
  if (newEntryItems != null) {
    newEntryItems.forEach(item => {
      let cell = '<a href="#" class="list-group-item list-group-item-action ">'
      +'<div class="d-flex w-100 justify-content-between">'
          +'<p style="width: 30%; text-align: left;"> '+item.ledger+' </p>'
          +'<p style="width: 15%;"> '+item.debit+' </p> '
          +'<p style="width: 15%;"> '+item.credit+' </p> '
          +'<p style="width: 30%;"> '+item.currency_code+'-'+item.currencies_rate+' </p>'
          +'<p style="width: 10%;"> '
          +'<button type="button" style="padding: 0px;" class="btn editItemNow" val=""><i class="fas fa-trash  fa-2X edit"></i></button> &nbsp; '
          +'</p>'
        +'</div>'
      +'</a>'

      totalDebit = totalDebit + parseInt(item.debit)
      totalCredit = totalCredit + parseInt(item.credit)

      $("#TotalDebit").val(totalDebit)
      $("#TotalCredit").val(totalCredit)
      $("#TotalDebit1").val(totalDebit)
      $("#TotalCredit1").val(totalCredit)

      console.log(totalCredit);
      
      newEntryItemsView.append(cell)
    });
  }
}

function addNewEnteysItem() {
  $('#addNewItemToEntry').on('click', function() {
    let cr = currencys[$('#currencyList').val()]
    let led = ledgers[$('#ledgerList').val()]

    // let ENVal
    let debit = 0
    let credit = 0

    if ($("#acctype").val() == "DR" ) {
      debit = $('#ENVal').val()
    }else if ($("#acctype").val() == "CR" ) {
      credit =  $('#ENVal').val()
    }else {
      return
    }

    let item = {'ledgers_id': led.id, 'ledger': led.name, 'debit': debit, 'credit': credit, 'currencies_id': cr.id, 'currency_code': cr.code, 'currencies_rate': $('#currencyRate').val()}
    // item['ledger'] = $('#ledgerList').val()
    // item['debit'] = $('#Debit').val()
    // item['credit'] = $('#Credit').val()
    // item['currency'] = $('#currencyList').val()
    newEntryItems.push(item)
    setNewEntryItemsList()
    $('#ENVal').val("")
    $('#currencyRate').val("")

    console.log(newEntryItems);
  })
}





