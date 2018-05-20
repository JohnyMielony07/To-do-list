var rows = 5;
var range_start = 0;
var range_meta = 0;

var  task = [];
var result = [];
var storedTasks = [];

//domyslne (startowe) elementy zawarte w tabeli na stronie
task[0] = 'Write a post, Medium, false';
task[1] = 'Make a dinner, High, true';
task[2] = 'Refuel the car, Low, false';
task[3] = 'Go for jogging, Medium, true';

toResult();

function toResult(){
    if(localStorage.getItem("tasks")){
        storedTasks = JSON.parse(localStorage.getItem("tasks"));
    }   
    result = task.concat(storedTasks);
    update();
    updateTableFooter();
}

//Wyswietlanie zawartosci listy na stronie
function update(){
    //usuniecie obecnej zawartosci tablicy aby dane nie zostaly zdublowane
    $('tbody tr').remove();
    
    if(range_start + rows < result.length) range_meta = range_start + rows;
    else range_meta = result.length;
    
    
    for(var i=range_start; i < range_meta; i++){
        
            //sprawdzenie czy element zostal wykonany czy nie
            var check;
            if(result[i].split(', ')[2] == 'true') check = '<input type="checkbox" checked="checked" class="check">';
            else check = '<input type="checkbox" class="check">';
            
            //kazdy element tablicy zostaje pociety i dodany do tabeli 
            $('tbody').append('<tr><td>' + result[i].split(', ')[0] + '</td><td>' + result[i].split(', ')[1] + '</td><td>' + check + '</td></tr>');
        }
    
        $('.check').prop({
        disabled: true
        });
}

//Zmiana ilosci wyswietlanych taskow
$('select').on('change', function(){
    var rowsPerPage = this.value;
    
    //w zaleznosci od wybranej opcji w tabeli bedzie wyswietlane 5, 10 lub 15 elementow
    if(rowsPerPage == 'fife'){
        rows = 5;
    }
    else if(rowsPerPage == 'ten'){
        rows = 10;
    }
    else if(rowsPerPage == 'fifteen'){
        rows = 15;
    }
    range_start = 0;
    update();
    updateTableFooter();
});

//Przejscie do poprzednich taskow
$('#back').on('click',function(e){
    e.preventDefault();
    if(range_start - rows >= 0){
        range_start -= rows;  
        update();
        updateTableFooter();
    }
    
});

//przejscie do nastepnych taskow
$('#forward').on('click',function(e){
    e.preventDefault();
    if(range_start + rows < result.length){
        range_start += rows;
        update();
        updateTableFooter();
    }
});

//funkcja odswiezajaca zawartosc footer w tabeli
//wywolywana przy wyswietlaniu kolejnych elementow, zmianie ilosci wyswietlanych elementow na stronie lub dodaniu nowego elelementu(tasku)
function updateTableFooter(){
    var firstN = range_start + 1;
    var secondN = range_meta;
    $('#number').html(firstN + '-' + secondN + ' of ' + result.length);
}

//CZEKANIE NA KLIKNIECIE W BELKE
$('thead th').on('click', function(){
    var headerNumber = 0;
    var $headerName =  this.id;
    
    //wybor kolumny wzgledem, ktorej beda sortowane elementy tablicy
    switch($headerName){
        case 'name':
            headerNumber = 0;
            break;
        case 'priority':
            headerNumber = 1;
            break;
        case 'done':
            headerNumber = 2;
            break;
    }
    
    //Wywolanie funkcji lub odwrocenie elementow w tabeli
        if($(this).hasClass('default') || $(this).hasClass('descending'))
        {
            sortBooble(headerNumber);
            $(this).removeClass('default').removeClass('descending').addClass('ascending');

            //Dodanie i usuniecie odpowiednich ikon sortowania
            $(this).siblings().removeClass().addClass('default')
                .children('.asc').addClass('hide').removeClass('vis');
             $(this).siblings().children('.desc').addClass('hide').removeClass('vis');

            $(this).children('.asc').addClass('vis').removeClass('hide');
            $(this).children('.desc').addClass('hide').removeClass('vis');
        }
        else
        {
            result.reverse();  
            $(this).addClass('descending');
            $(this).removeClass('ascending');

            //Dodanie i usuniecie odpowiednich ikon sortowania
            $(this).siblings().removeClass().addClass('default')
                .children('.desc').addClass('hide').removeClass('vis');
            $(this).siblings().children('.asc').addClass('hide').removeClass('vis');

            $(this).children('.desc').addClass('vis').removeClass('hide');
            $(this).children('.asc').addClass('hide').removeClass('vis');
        }
        update();  
});

//SORTOWANIE TASKOW W TABELI
function sortBooble(order){
    var len = result.length;

        var k, j, tmp;
        
    //Sortowanie metoda Booble sort
    
        for(j = 0; j < len - 1; j++) {
            for(k = 0; k < len - 1; k++) {
                
                //dwa elementy danej kolumny sa "wycinane" z tablicy i porownywane ze sobą
                //parametr order wskazuje wzgledem ktorej kolumny bedzie sortowana tablica
                if(result[k].split(', ')[order] > result[k + 1].split(', ')[order]) {
                    
                    //elementy w tablicy sa zamieniane ze soba miejscami
                    tmp = result[k]; 
                    result[k] = result[k + 1]; 
                    result[k + 1] = tmp;
                }
            }
        }
}

//DODAWANIE NOWEGO ELEMENTU
$('form').on('submit', function(e){
    e.preventDefault();
    
    var elName = $('#taskName').val();
    var elPriority = $('#taskPriority').val();
    var elDone = $('#taskDone');
    
    //Podstawowe zabezpieczenie przed atakami XSS
    elName = elName.replace('<','&lt');
    elName = elName.replace('>','&gt');
    
    if(elDone.is( ":checked" )) elDone = true;
    else elDone = false;
    
    var newElem = elName + ', ' + elPriority + ', ' + elDone;
    addToLocalStorage(newElem);
});

//ZAPISANIE NOWEGO ELEMENTU W LOCAL STORAGE
function addToLocalStorage(elem){
    storedTasks.push(elem);
    localStorage.setItem("tasks", JSON.stringify(storedTasks));

    update();
    updateTableFooter();
    toResult();
}