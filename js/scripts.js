/* функция для сборки страницы по выбранной вещи */
function getDetails(category, itemID) {
    var questionInMenu = document.getElementById('question ' + itemID)
    var prevSelectQ = document.getElementById(sessionStorage.getItem('prevSelectQuestion') || 'question 1')
    var details = document.getElementsByClassName('details')[0]
    var photo = document.getElementById('photo')
    var images = ''

    photo.innerHTML = ''
    if ('photo' in myItems[category][itemID]) {
        for (var i in myItems[category][itemID]['photo']) {
            images += `<img class="photo" src="./img/${myItems[category][itemID]['photo'][i]}"
                                       alt="photo" onclick="showPopup(this);">`
        }
        photo.insertAdjacentHTML('afterbegin', images)
    }

    document.getElementById('description').innerHTML = myItems[category][itemID]['description']
    document.getElementById('name').innerHTML = myItems[category][itemID]['name']
    document.getElementById('actual').innerHTML = myItems[category][itemID]['actual']
    document.getElementById('buy-date').innerHTML = myItems[category][itemID]['buyDate']
    document.getElementById('price').innerHTML = myItems[category][itemID]['price']

    if ('color' in myItems[category][itemID]) {
        if (document.getElementById('color')) {
            document.getElementById('color').innerHTML = myItems[category][itemID]['color']
        } else {
            var color = `<div class="details-item-box">
                            <div class="title-mini">Цвет</div>
                            <div class="details-item" id="color">${myItems[category][itemID]['color']}</div>
                         </div>`
            document.getElementById('details-container').insertAdjacentHTML('beforeend', color)
        }
    }

    if ('size' in myItems[category][itemID]) {
        if (document.getElementById('size')) {
            document.getElementById('size').innerHTML = myItems[category][itemID]['size']
        } else {
            var size = `<div class="details-item-box">
                            <div class="title-mini">Размер</div>
                            <div class="details-item" id="size">${myItems[category][itemID]['size']}</div>
                         </div>`
            document.getElementById('details-container').insertAdjacentHTML('beforeend', size)
        }
    }

    if ('buyPlace' in myItems[category][itemID]) {
        if (document.getElementById('buy-place')) {
            document.getElementById('buy-place').innerHTML = myItems[category][itemID]['buyPlace']
        } else {
            var buyPlace = `<div class="details-item-box">
                            <div class="title-mini">Место покупки</div>
                            <div class="details-item" id="buy-place">${myItems[category][itemID]['buyPlace']}</div>
                         </div>`
            document.getElementById('details-container').insertAdjacentHTML('beforeend', buyPlace)
        }
    }

    if ('grade' in myItems[category][itemID]) {
        if (document.getElementById('grade')) {
            document.getElementById('grade').innerHTML = myItems[category][itemID]['grade']
        } else {
            var grade = `<div class="details-item-box">
                            <div class="title-mini">Статус</div>
                            <div class="details-item" id="grade">${myItems[category][itemID]['grade']}</div>
                         </div>`
            document.getElementById('details-container').insertAdjacentHTML('beforeend', grade)
        }
    }

    if (document.getElementById('lifetime')) {
        document.getElementById('lifetime').innerHTML = getLifetime(category, itemID, 'buyDate')
    } else {
        var lifetime = `<div class="details-item-box">
                        <div class="title-mini">Срок эксплуатации</div>
                        <div class="details-item" id="lifetime">${getLifetime(category, itemID, 'buyDate')}</div>
                     </div>`
        document.getElementById('details-container').insertAdjacentHTML('beforeend', lifetime)
    }

    if ('review' in myItems[category][itemID]) {
        if (document.getElementById('review')) {
            document.getElementById('review').innerHTML = myItems[category][itemID]['review']
        } else {
            var review = `<div class="details-item-box">
                            <div class="title-mini">Отзыв</div>
                            <div class="details-item" id="review">${myItems[category][itemID]['review']}</div>
                         </div>`
            document.getElementById('details-container').insertAdjacentHTML('beforeend', review)
        }
    }

    if (prevSelectQ) {
        prevSelectQ.classList.remove('select-item')
    }

    questionInMenu.classList.add('select-item')
    sessionStorage.setItem('prevSelectQuestion', 'question ' + itemID)
}

/* функция для сборки списка вещей по отдельной категории */
function getItemsList(category) {
    var questionsContainer = document.getElementsByClassName('items-container')[0]
    var questionsHTML = ''
    var sortedKeys = sortItems(myItems[category])

    for (let i in sortedKeys) {
        let item = myItems[category][sortedKeys[i]]
        var class_ = item['actual'] != 'в наличии' ? "itemInCatalog crossed-out" : "itemInCatalog"
        questionsHTML += `<div id="question ${sortedKeys[i]}" class="${class_}" onclick="getDetails('${category}', ${sortedKeys[i]})">${item['name']}</div>`
    }
    questionsContainer.innerHTML = questionsHTML
}

function getLayout(category) {
    // сохраняем категорию в объекте sessionStorage браузера
    sessionStorage.setItem("category", category)
    // обновляем страницу
    window.location.href = window.location.href

    //if (category == 'main') {}
}

// показ оригинального изображения при клике на миниатюру
function showPopup(element) {
    const parent = element.parentNode;
    const popup = document.createElement('div');
    const img = document.createElement('img');
    img.src = element.src;
    popup.appendChild(img);
    popup.classList.add('popup');
    parent.appendChild(popup);
    popup.addEventListener('click', () => {
        popup.remove();
    });
    popup.style.display = 'flex';
}

/* функция для вычисления срока эксплуатации вещи */
function getLifetime(category, itemID, buyDate) {
    // учесть вариант когда есть только месяц и год или вообще нет даты
    const dateString = myItems[category][itemID][buyDate]
    var dateParts = dateString.split('.').map(part => parseInt(part)); // преобразуем заданную дату в массив чисел
    const dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // создаем объект Date из заданной даты
    const currentDateObject = new Date(); // текущая дата и время

    if ('end' in myItems[category][itemID]) {
        dateParts = myItems[category][itemID]['end'].split('.').map(part => parseInt(part))
        let endTime = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
        delta = endTime.getTime() - dateObject.getTime();
    } else {
        delta = currentDateObject.getTime() - dateObject.getTime();
    }
    let years = Math.floor(delta / (1000 * 60 * 60 * 24 * 365));
    delta -= years * (1000 * 60 * 60 * 24 * 365);
    let months = Math.floor(delta / (1000 * 60 * 60 * 24 * 30));
    delta -= months * (1000 * 60 * 60 * 24 * 30);
    let days = Math.floor(delta / (1000 * 60 * 60 * 24));
    let resultString = '';

    if (years) {
        resultString += `${years} ${pluralize(years, 'год', 'года', 'лет')}`;
    }
    if (months) {
        if (resultString) {
            resultString += `, ${months} ${pluralize(months, 'месяц', 'месяца', 'месяцев')}`
        } else {
            resultString += `${months} ${pluralize(months, 'месяц', 'месяца', 'месяцев')}`
        }
    }
    if (days) {
        if (resultString) {
            resultString += `, ${days} ${pluralize(days, 'день', 'дня', 'дней')}`
        } else {
            resultString += `${days} ${pluralize(days, 'день', 'дня', 'дней')}`
        }
    }

    return resultString
}

// функция для склонения лет, месяцев и дней
function pluralize(number, one, few, many) {
  if (number === 1 || number === 21 || number === 31) {
    return one;
  }
  const mod10 = number % 10;
  const mod100 = number % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few;
  }
  return many;
}

/* функция для подсчёта количества всех вещей (актуальные + неактуальные) */
function fillCounters() {
    var itemsCounter = 0

    for (var key in myItems) {
      if (myItems.hasOwnProperty(key)) {
        if (key != 'main') {
          var count = Object.keys(myItems[key]).length;
          itemsCounter += count
          document.getElementsByClassName(`${key}`)[0].children[0].textContent = count
        }
      }
    }
    document.getElementById('items-count').innerHTML = itemsCounter
}

/* функция для сборки текста для главной страницы */
function getMainText() {
    var mainText = `
        <div class="main-page-content">
            Каталог личных вещей, в том числе уже проданных/отданных/выкинутых. Каждая вещь имеет подробное описание,
            фото, дату, цену и место покупки, текущий статус и дальнейшую судьбу вещи. Обозначение актуальная/неактуальная
            означает использую ли я эту вещь до сих пор или её у меня уже нет.<br>
            <br>
            ${getItemsValue()}
        </div>
    `

    return mainText
}

/* функция для получения суммарной стоимости вещей в разбивке по году, категории и актуальности */
function getItemsValue() {
    var result = {
        'clothes_up': {'actual': 0, 'notActual': 0},
        'clothes_down': {'actual': 0, 'notActual': 0},
        'clothes_boots': {'actual': 0, 'notActual': 0},
        'books': {'actual': 0, 'notActual': 0},
        'furniture': {'actual': 0, 'notActual': 0},
        'electronics': {'actual': 0, 'notActual': 0},
        'sport': {'actual': 0, 'notActual': 0},
        'dishes': {'actual': 0, 'notActual': 0},
        'other': {'actual': 0, 'notActual': 0},
        'valueOfActualItems': 0,
        'valueOfNotActualItems': 0
    }

    var sumByYear = {}

    for (let category in myItems) {
        for (let i in myItems[category]) {
            var item = myItems[category][i]
            if ('price' in item && item['price'].match(/\d+/)) {
                let spendMoney = parseInt(item['price'].match(/\d+/)[0])
                let year = parseInt(item['buyDate'].slice(-4))
                sumByYear[year] = sumByYear[year] ? sumByYear[year] + spendMoney : spendMoney
                if (item['actual'] == 'в наличии') {
                    result['valueOfActualItems'] += spendMoney
                    result[category]['actual'] += spendMoney
                } else {
                    result['valueOfNotActualItems'] += spendMoney
                    result[category]['notActual'] += spendMoney
                }
            }
        }
    }

    var sumByYearText = ''
    console.log(sumByYear)
    var sortedKeys = Object.keys(sumByYear).sort(function(a, b) {
        return b - a;
    });
    console.log(sortedKeys)
    for (let year in sortedKeys) {
        sumByYearText += `${sortedKeys[year]} год: ${sumByYear[sortedKeys[year]]} руб<br>`
    }
    var result = `Суммарная стоимость покупки актуальных вещей: ${result['valueOfActualItems']} руб<br>
                  Суммарная стоимость покупки неактуальных вещей: ${result['valueOfNotActualItems']} руб<br>
                  <br>
                  Одежда (верх):_____${result['clothes_up']['actual']} руб | ${result['clothes_up']['notActual']} руб<br>
                  Одежда (низ):______${result['clothes_down']['actual']} руб | ${result['clothes_down']['notActual']} руб<br>
                  Обувь:____________${result['clothes_boots']['actual']} руб | ${result['clothes_boots']['notActual']} руб<br>
                  Книги:____________${result['books']['actual']} руб | ${result['books']['notActual']} руб<br>
                  Электроника:______${result['electronics']['actual']} руб | ${result['electronics']['notActual']} руб<br>
                  Мебель:___________${result['furniture']['actual']} руб | ${result['furniture']['notActual']} руб<br>
                  Спорт:____________${result['sport']['actual']} руб | ${result['sport']['notActual']} руб<br>
                  Посуда:____________${result['dishes']['actual']} руб | ${result['dishes']['notActual']} руб<br>
                  Прочее:___________${result['other']['actual']} руб | ${result['other']['notActual']} руб
                  <br><br>
                  Затраты по году:<br>
                  ${sumByYearText}`

    return result.replaceAll('*', '&nbsp;')
}

/*
функция для сортировки вещей
1) Сначала вещи сортируются на две группы - первой группой идут актуальные вещи, второй группой неактуальные
2) Далее в каждой группе производится сортировка по цене покупки в порядке убывания
возвращает список отсортированных ключей
*/
function sortItems(itemsList) {
    var sortedKeys = Object.keys(itemsList).sort(function(a, b) {
      if (itemsList[a].actual === 'в наличии' && itemsList[b].actual !== 'в наличии') {
        return -1; // a перед b
      } else if (itemsList[a].actual !== 'в наличии' && itemsList[b].actual === 'в наличии') {
        return 1; // b перед a
      } else {
        // Если оба элемента в наличии или оба не в наличии, то сравниваем по price в порядке убывания
        return parseInt(itemsList[b].price.match(/\d+/)[0]) - parseInt(itemsList[a].price.match(/\d+/)[0]);
      }
    });

    return sortedKeys
}
