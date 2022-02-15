//Storage
const StorageCtrl = (function(){


    return{
        storeItem: function(item){
            let items = [];
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updateItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(updateItem.id === item.id){
                    items.splice(index, 1, updateItem);
                }
            })
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage(){
            let itemCurrent = itemCtrl.getCurrentItem();
            let items = JSON.parse(localStorage.getItem('items'));

            items = items.filter((item)=>{
                if (item.id !== itemCurrent.id){
                    return item;
                }
            })
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearStorage: function(){
            localStorage.setItem('items', JSON.stringify([]));
        }
    }

})();
//Item
const itemCtrl = (function(){
//item constructor
const item = function (id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
}
// Data Structure
let data = {
    items: StorageCtrl.getItemsFromStorage(),
    // items:[
    //     {id: 0, name: 'Steak Dinner', calories: 1200},
    //     {id: 1, name: 'Bread', calories: 300},
    //     {id: 2, name: 'Eggs', calories: 600},
    // ],
    currentItem: null,
    totalCalories: 0
}
let a = 10;

return{
    getItems: function(){
        return data.items;
    }, 
    addItem: function(name, calories){
        let ID;
        //ID
        if(data.items.length > 0){
            ID = data.items[data.items.length - 1].id + 1;
        } else {
            ID = 0;
        }

        calories = +calories;

        //Create new item

        const newItem = new item (ID, name, calories);

        data.totalCalories += newItem.calories;

        data.items.push(newItem);

        return newItem;
    },
    getItemByID: function(id){
        let found = null;
        data.items.forEach((item)=>{
            if (item.id === id){
                found = item;
            }
        })
        return found;
    },
    updateItem: function(name, calories){
        calories = +calories;
        let found = 0;

        data.items.forEach((item)=>{
            if(item.id === data.currentItem.id){
                item.name = name;
                item.calories = calories;
                found = item;
            }
        })
        return found;
    },
    setCurrentItem: function(item){
        data.currentItem = item;
    },
    getCurrentItem: function(){
        return data.currentItem;
    },
    logData: function(){
        return data;
    },
    initiateCalories: function(){
        data.totalCalories = 0;
        data.items.forEach(function(item){
            data.totalCalories += item.calories;
        })
    },
    clearData: function(){
        data.items = [];
        data.currentItem = null;
        data.totalCalories = 0;
        
    },
    deleteItemFromData: function(){
        let item = this.getCurrentItem();

        data.items = data.items.filter((item)=>{
            if(item.id !== data.currentItem.id){
                return item;
            }
        })
    }
}
})();

//UI
const UICtrl = (function(){
    const UISelector = {
        itemsList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCaloriesField: '.total-calories'
    }
    // const getItemInput
    return{
        populateItemList: function(items){
            itemCtrl.initiateCalories();
            let html = '';
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            });

            document.querySelector(UISelector.itemsList).innerHTML = html;

            UICtrl.setCalories();
        },
        getSelectors: function(){
            return UISelector;
        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelector.itemNameInput).value,
                calories: document.querySelector(UISelector.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            UICtrl.showList();
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelector.itemsList).insertAdjacentElement('beforeend', li);

            UICtrl.setCalories();
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelector.listItems);

            listItems = Array.from(listItems);

            listItems.forEach((listItem)=>{
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            })
        },
        clearFields: function(){
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelector.itemNameInput).value = itemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = itemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelector.itemsList).style.display = 'none';
        },
        showList: function(){
            document.querySelector(UISelector.itemsList).style.display = 'block';
        },
        setCalories: function(){
            const totalCalories = itemCtrl.logData();
            document.querySelector(UISelector.totalCaloriesField).textContent = totalCalories.totalCalories;
        },
        ClearEditState: function(){
            UICtrl.clearFields();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        deleteItemFromList: function(){
            let item = itemCtrl.logData();
            item = item.currentItem;
            let listItems = document.querySelectorAll(UISelector.listItems);

            listItems = Array.from(listItems);

            listItems.forEach((listItem)=>{
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).remove();
                }
            })
        }
    }
})();
 
//App
const App = (function(itemCtrl, StorageCtrl, UICtrl){

    UICtrl.ClearEditState();

    const loadEventListeners = function(){

        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        document.querySelector(UISelectors.itemsList).addEventListener('click', itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        document.querySelector(UISelectors.backBtn).addEventListener('click', backToState);
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAll);
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', getItemDeleted);
        //disable enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13){
                e.preventDefault();
                return false;
            }
        });
    }

    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();

        if (input.name !== '' && input.calories !== ''){
           const newItem = itemCtrl.addItem(input.name, input.calories);
            UICtrl.addListItem(newItem);

            StorageCtrl.storeItem(newItem);

            UICtrl.clearFields();
        }
        

        e.preventDefault();
    }

    const itemEditClick = function(e){
        if (e.target.classList.contains('edit-item')){
            let listID = e.target.parentNode.parentNode.id;
            listID = +/\d+/.exec(listID);

            const itemToEdit = itemCtrl.getItemByID(listID);
            
            itemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
    
        }
    }
    const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput();

        //update item

        const updatedItem = itemCtrl.updateItem(input.name, input.calories)

        UICtrl.updateListItem(updatedItem);
        itemCtrl.initiateCalories();
        UICtrl.setCalories();

        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.ClearEditState();


        e.preventDefault();
    }

    const backToState = function(){
        UICtrl.ClearEditState();
    }
    const clearAll = function(){
        itemCtrl.clearData();
        StorageCtrl.clearStorage();
        UICtrl.hideList();
        UICtrl.setCalories();
   
    }
    const getItemDeleted = function(){
        itemCtrl.deleteItemFromData()
        UICtrl.deleteItemFromList();
        itemCtrl.initiateCalories();
        UICtrl.setCalories();
        UICtrl.ClearEditState();
        StorageCtrl.deleteItemFromStorage();
    }

    return{
        init: function(){

            const items = itemCtrl.getItems();
            if (items.length === 0){
                UICtrl.hideList();
            }else{

                UICtrl.populateItemList(items);
                
            }
            loadEventListeners();
        }
    }

})(itemCtrl, StorageCtrl, UICtrl);

App.init();