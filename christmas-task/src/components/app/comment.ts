export const comment = () => {
  console.log(`
Оценка 200/200
  Функционал приложения
1.	Вёрстка страниц приложения и навигация между ними +30
o	стартовая страница содержит название приложения и кнопку "Начать игру" или аналогичную. Выполняются требования к вёрстке +10
o	на странице с ёлкой есть меню с настройками, слоты с добавленными в избранное игрушками, ёлка. Выполняются требования к вёрстке +10
o	в header приложения есть навигация, которая позволяет с каждой страницы приложения перейти на две другие страницы +10
2.	Меню с настройками +50
У пользователя есть возможность:
o	выбрать один из нескольких (минимум 8) фонов +10
o	выбрать одну из нескольких (минимум 4) ёлок +10
o	включить/отключить падающий снег +10
o	включить/отключить новогоднюю музыку +10
o	выбранные настройки сохраняются в local storage и отображаются при перезагрузке страницы. Если музыка сохранилась включённой, она начинает играть при первом клике. Есть кнопка сброса настроек, которая очищает local storage +10
3.	Гирлянда +40
Гирлянда реализуется средствами css без использования изображений
Гирлянда на ёлку добавляется динамически средствами JavaScript (на кросс-чеке этот пункт не проверяется)
У пользователя есть возможность:
o	добавить на ёлку мерцающую разноцветную гирлянду +20
o	выбрать один из нескольких (минимум 4) цветов лампочек гирлянды или оставить её разноцветной +10
o	внешний вид гирлянды соответствует предложенному образцу или является его улучшенной версией +10
4.	Игрушки в избранном +80
o	в слотах находятся игрушки, которые были добавлены в избранное на странице с игрушками +10
o	если в избранное не была добавлена ни одна игрушка, в слотах отображаются первые 20 игрушек коллекции исходных данных +10
o	игрушки из слотов с игрушками можно перетянуть на ёлку используя drag and drop +10
o	если в процессе перетягивания игрушку отпускают за пределами ёлки, она возвращается в свой слот +10
o	повешенные на ёлку игрушки можно перетягивать в пределах ёлки +10
o	повешенные на ёлку игрушки можно снимать с ёлки, при этом они возвращаются в свой слот +10
o	возле слота с каждой игрушкой указывается количество игрушек в слоте равное количеству экземпляров игрушки в массиве с исходными данными +10
o	когда игрушку "вешают на ёлку" количество игрушек в слоте уменьшается, когда игрушку "снимают с ёлки", количество игрушек в слоте увеличивается, когда все экземпляры игрушки помещаются на ёлку, отображается пустой слот +10
5.	Дополнительный функционал на выбор +15
o	есть кнопка "Сохранить" при клике по которой текущее состояние страницы с ёлкой сохраняется в local storage, изображение ёлки с размещёнными на ней игрушками добавляется в секцию "Вы нарядили". При клике по карточкам из этой секции восстанавливается состояние страницы с ёлкой на момент сохранения +5 (сохраняется 1 состояние автоматически)
Состояние страницы включает в себя настройки меню на момент сохранения, размещённые на ёлке игрушки, игрушки в избранном - их вид, порядок, количество
o	очень высокое качество оформления приложения + дополнительный, не указанный в задании, сложный в реализации функционал, улучшающий качество приложения, удобство пользования им (добавлен функционал автогенерации елки) +10
`);
};
