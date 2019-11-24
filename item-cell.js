// let Primarys = document.getElementById('Primarys')

exports.addItem = (primary, index)=> {
    let item = document.createElement('a')
    item.setAttribute('class', 'list-group-item list-group-item-action listItemsCotroller') 
    item.innerHTML = '<div class="d-flex w-100 justify-content-between ">'
        +'<h5 class="mb-1" style="width: 50%;">'+primary.name+'</h5>'
        // +'<small>'+primary.created_at+'</small>'
        +'<div style="float: right;"> '
        +'<button style="padding: 5px;" class="btn editItemNow" val="'+index+'"><i class="fas fa-edit  fa-2X edit"></i></button> &nbsp; '
        +'<button style="padding: 5px;" class="btn deleteItemNow" val="'+primary.id+'"><i class="fas fa-trash fa-2X trash" ></i></button></div>'
        +'</div>'

        +''
        // +'<p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>'
        // +'<small>Donec id elit non mi porta.</small>'
        
    return item
}

