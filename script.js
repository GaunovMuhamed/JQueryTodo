/* global _ */
$(document).ready(() => {

    const ADDING_TODO = function() {
        const q = 10000;
        const todo = {
            check: false,
            id: `li${Math.round(Math.random() * q)}${1}`,
            value: _.escape($NEW_INPUT_DOM.val()),
        };

        todos.push(todo);

        $NEW_INPUT_DOM.val('');
    };

    const RENDER = function() {
        console.log(showChecked);
        if (showChecked) {
            $CHECKED_BUTTON_DOM.addClass('botCommandsPressed').removeClass('botCommands');
        } else {
            $CHECKED_BUTTON_DOM.addClass('botCommands').removeClass('botCommandsPressed');
        }
        if (showUnchecked) {
            $UNCHECKED_BUTTON_DOM.addClass('botCommandsPressed').removeClass('botCommands');
        } else {
            $UNCHECKED_BUTTON_DOM.addClass('botCommands').removeClass('botCommandsPressed');
        }
        if (showAll) {
            $SHOW_ALL_BUTTON_DOM.addClass('botCommandsPressed').removeClass('botCommands');
        } else {
            $SHOW_ALL_BUTTON_DOM.addClass('botCommands').removeClass('botCommandsPressed');
        }

        $MAIN_LIST.empty();

        let todosArray = [];

        if (filtered) {
            todosArray = FILTERED_TODOS;
        } else {
            todosArray = todos;
        }

        if (todosArray.length) {
            const CURRENT_PAGE_MINUS_ONE_MULTIPLE_FIVE = (currentPage - 1) * FIVE;

            const CURRENT_PAGE_MINUS_ONE_MULTIPLE_FIVE_PLUS_FIVE = CURRENT_PAGE_MINUS_ONE_MULTIPLE_FIVE + FIVE;

            for (let i = CURRENT_PAGE_MINUS_ONE_MULTIPLE_FIVE; i < todosArray.length; i++) {
                if (i < CURRENT_PAGE_MINUS_ONE_MULTIPLE_FIVE_PLUS_FIVE) {
                    $MAIN_LIST.append($(`<li id = ${todosArray[i].id} class="ad">
             <label class="container">
             <input type="checkbox" 
             class="check" ${todosArray[i].check ? 'checked' : null}>
             <span class="checkmark"></span></label>
             <input class="msg" readonly=true value=${todosArray[i].value}>
             <img class="cross" src="Resources/Images/cross.png"></li>`));
                } else {
                    break;
                }
            }
        }

        if (currentPage === ONE) {
            PAGINATION_BUTTONS[0] = ONE;
            PAGINATION_BUTTONS[ONE] = TWO;
            PAGINATION_BUTTONS[TWO] = THREE;
        }


        if (todos.length > 0) {
            $MAIN_LIST.append($BOTTOM);
            PAGINATION_BUTTONS[THREE] = Math.ceil(todosArray.length / FIVE);

            $MAIN_LIST.append($(`<div id="pages">
<input type="button" id="btnleft" class="pagebuttons" value="<<">
<input 
type="button" 
id="btn0" 
class="pagebuttons" 
value=${PAGINATION_BUTTONS[0]}>
<input 
type="button" 
id="btn1" 
class="pagebuttons" 
value=${PAGINATION_BUTTONS[1]} ${PAGINATION_BUTTONS[1] > PAGINATION_BUTTONS[THREE] ? 'hidden' : null}>
<input
type="button" 
id="btn2" 
class="pagebuttons" 
value=
${PAGINATION_BUTTONS[TWO]} ${PAGINATION_BUTTONS[TWO] > PAGINATION_BUTTONS[THREE] ? 'hidden' : null}>
<input type="button" id="btnnone" value="..." disabled>
<input 
type="button" 
id="btnend" 
class="pagebuttons" 
value=${PAGINATION_BUTTONS[THREE]}>
<input 
type="button" 
id="btnright" 
class="pagebuttons" 
value=">>">
</div>`));
        }

        PAGINATION_BUTTONS.forEach((element, i) => {
            if (i !== THREE) {
                if (element === currentPage) {
                    $(`#btn${i}`).css('background', 'grey');
                }
            }
        });

        if (todos.length > 0) {
            $ARROW_BUTTON.css('visibility', 'visible');
        } else {
            $ARROW_BUTTON.css('visibility', 'hidden');
        }

        if (allchecked) {
            $ARROW_BUTTON.css('background-color', 'grey');
        } else {
            $ARROW_BUTTON.css('background-color', 'transparent');
        }


        $CHECKED_COUNT_DOM.val(() => {
            let cnt = 0;

            todos.forEach(i => {
                if ($(i).attr('check') === true) {
                    cnt++;
                }
            });

            return `Done: ${cnt}`;
        });

        $UNCHECKED_COUNT_DOM.val(() => {
            let cnt = 0;

            todos.forEach(i => {
                if ($(i).attr('check') === false) {
                    cnt++;
                }
            });

            return `Undone: ${cnt}`;
        });
    };

    const GET_NEW_TODO = function() {
        if ($NEW_INPUT_DOM.val() !== '' && $('#newinp').val()
            .replace(/\s/gu, '').length) {
            filtered = false;

            if (todos.length % FIVE === 0 && todos.length > FOUR) {
                currentPage++;
            }

            ADDING_TODO();
            RENDER();

            if (todos.length % FIVE === 0) {
                if (PAGINATION_BUTTONS[THREE] === PAGINATION_BUTTONS[TWO]) {
                    PAGINATION_BUTTONS[TWO] = PAGINATION_BUTTONS[THREE] + 1;
                    PAGINATION_BUTTONS[ONE] = PAGINATION_BUTTONS[TWO] - 1;
                    PAGINATION_BUTTONS[0] = PAGINATION_BUTTONS[1] - 1;
                }
            }
            console.log(currentPage);
        }
    };

    const ARROW_CHECK_UNCHECK = function() {
        if (allchecked) {
            todos.forEach(i => {
                i.check = false;
            });
        } else {
            allchecked = true;
            todos.forEach(i => {
                i.check = true;
            });
        }

        RENDER();
    };

    const CHANGE_CHECK_MODE = function(a, b, c) {
        showAll = a;
        showChecked = b;
        showUnchecked = c;
    };

    const SET_CURRENT_PAGE = function(indexOfPaginationButton) {
        [currentPage] = [PAGINATION_BUTTONS[indexOfPaginationButton]];
        RENDER();
    };

    const CHANGE_TODO = function() {
        const GOT_TEXT_FROM_INPUT = _.escape($(this).val().trim());
        const TODO_ID  =  $(this).closest('li').attr('id');

        todos.forEach(item=>{
            if(item.id==TODO_ID){
                if(GOT_TEXT_FROM_INPUT){
                    item.value=GOT_TEXT_FROM_INPUT;
                }
            }
        });

        $(this).attr('readonly', true);
        $(this).css('border', 'none');
        RENDER();
    };

    const FILTERED_TODOS = [];
    const $BOTTOM = $(`<li id="bottom">
<input 
id="showall" 
class="botCommands" 
value="Show all" 
readonly="true">
<input 
id="checked" 
class="botCommands" 
value="Show checked" 
readonly="true">
<input id="unchecked" 
class="botCommands" 
value="Show unchecked" 
readonly="true">
<input id="removechecked" 
class="botCommands" 
value="Remove checked" 
readonly="true">
</li>`);
    const ONE = 1;
    const TWO = 2;
    const THREE = 3;
    const FOUR = 4;
    const ENTER_CODE = 13;
    const FIVE = 5;
    const PAGINATION_BUTTONS = [
        ONE,
        TWO,
        THREE,
        FOUR,
    ];
    const $CHECKED_BUTTON_DOM = $('#checked');
    const $UNCHECKED_BUTTON_DOM = $('#unchecked');
    const $SHOW_ALL_BUTTON_DOM = $('#showall');
    const $MAIN_LIST = $('#list');
    const $ARROW_BUTTON = $('#arrow');
    const $CHECKED_COUNT_DOM = $('#checkedCount');
    const $UNCHECKED_COUNT_DOM = $('#uncheckedCount');
    const $NEW_BUTTON = $('#newbtn');
    const $NEW_INPUT_DOM = $('#newinp');

    let currentPage = 1;
    let filtered = false;
    let showAll = false;
    let showChecked = false;
    let showUnchecked = false;
    let allchecked = false;
    let todos = [];

    $NEW_BUTTON.on('click', GET_NEW_TODO());

    $NEW_BUTTON.on('click', e => {
        GET_NEW_TODO();
    });

    $NEW_INPUT_DOM.on('keydown', e => {
        if (e.which === ENTER_CODE) {
            GET_NEW_TODO();
        }
    });

    $MAIN_LIST.on('click', '.cross', function() {
        const GET_ID = $(this).closest('li')
            .attr('id');


        for(let i = 0; i<todos.length;i++){
            if($(todos[i]).attr('id')===GET_ID){
                todos.splice(i,1);
            }
        }

        for(let i = 0; i<FILTERED_TODOS.length;i++){
            if($(FILTERED_TODOS[i]).attr('id')===GET_ID){
                FILTERED_TODOS.splice(i,1);
            }
        }

        /*todos.forEach(function(element,index){
            if($(element).attr('id')===GET_ID){
                todos.splice(index,1);
            }
        });

        FILTERED_TODOS.forEach(function(element,index){
            if($(element).attr('id')===GET_ID){
                todos.splice(index,1);
            }
        });*/

        if (todos.length % FIVE === 0 && currentPage > 1) {
            currentPage--;
        }

        RENDER();
    });

    $ARROW_BUTTON.on('click', ARROW_CHECK_UNCHECK);

    $MAIN_LIST.on('click', 'span', function() {
        const getid = $(this).closest('li')
            .attr('id');

        todos.forEach(i => {
            if ($(i).attr('id') === getid) {
                i.check = !i.check;
            }
        });
    });

    $MAIN_LIST.on('dblclick', '.msg', function() {
        $(this).attr('readonly', false)
            .focus();
        $(this).css('border', 'solid');
    });

    $MAIN_LIST.on('keypress', '.msg', function(e) {
        if (e.which === ENTER_CODE) {
            Reflect.apply(CHANGE_TODO, $(this), $(this));
        }
    });

    $MAIN_LIST.on('click', '#removechecked', () => {
        CHANGE_CHECK_MODE(true, false, false);

        todos = todos.filter(i => i.check === false);

        filtered = false;

        RENDER();
    });

    $MAIN_LIST.on('click', '#checked', () => {
        CHANGE_CHECK_MODE(false, true, false);

        FILTERED_TODOS.length = 0;
        todos.forEach(i => {
            if ($(i).attr('check') === true) {
                FILTERED_TODOS.push(i);
            }
        });
        currentPage = 1;
        filtered = true;
        RENDER();
    });

    $MAIN_LIST.on('click', '#unchecked', () => {
        CHANGE_CHECK_MODE(false, false, true);

        FILTERED_TODOS.length = 0;

        todos.forEach(i => {
            if ($(i).attr('check') === false) {
                FILTERED_TODOS.push(i);
            }
        });

        currentPage = 1;
        filtered = true;
        RENDER();
    });

    $MAIN_LIST.on('click', '#showall', () => {
        filtered = false;

        CHANGE_CHECK_MODE(true, false, false);

        RENDER();
    });

    $MAIN_LIST.on('click', '#btnend', () => {
        [currentPage] = [PAGINATION_BUTTONS[THREE]];
        RENDER();
    });

    $MAIN_LIST.on('click', '#btn0', () => {
        SET_CURRENT_PAGE(0);
    });

    $MAIN_LIST.on('click', '#btn1', () => {
        SET_CURRENT_PAGE(ONE);
    });

    $MAIN_LIST.on('click', '#btn2', () => {
        SET_CURRENT_PAGE(TWO);
    });

    $MAIN_LIST.on('click', '#btnleft', () => {
        if (currentPage > 1) {
            currentPage--;
        }

        if (PAGINATION_BUTTONS[0] > 1) {
            for (let i = 0; i < PAGINATION_BUTTONS.length; i++) {
                PAGINATION_BUTTONS[i]--;
            }
        }

        RENDER();
    });

    $MAIN_LIST.on('click', '#btnright', () => {
        if (currentPage < PAGINATION_BUTTONS[THREE]) {
            currentPage++;
        }

        if (PAGINATION_BUTTONS[TWO] < PAGINATION_BUTTONS[THREE]) {
            for (let i = 0; i < PAGINATION_BUTTONS.length; i++) {
                PAGINATION_BUTTONS[i]++;
            }
        }

        RENDER();
    });

    //added
});


