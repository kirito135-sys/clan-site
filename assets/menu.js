// Меню клан-сайта: единственный список страниц.
// Добавляешь новую страницу — дописываешь ОДНУ строку сюда,
// и пункт появится в шапке на всех страницах сразу.
const MENU = [
  ['index.html','🏠 Главная'],
  ['gear-weapons.html','🛡 Экипировка'],
  ['dungeons.html','🏰 Данжи'],
  ['builds.html','📖 Билды'],
  ['skills.html','📊 Умения'],
  ['exchange.html','💱 Обмен'],
  ['rental.html','📦 Аренда'],
  ['bosses.html','🐲 Рейд-боссы'],
  ['bots.html','🤖 Боты'],
  ['compare.html','⚖️ Сравнение']
];
function renderMenu(){
  const here = location.pathname.split('/').pop() || 'index.html';
  const header = document.querySelector('header');
  if(!header) return;
  header.innerHTML = MENU.map(([f,t])=>`<a href="${f}"${f===here?' class="active"':''}>${t}</a>`).join('\n');
}
document.addEventListener('DOMContentLoaded', renderMenu);
