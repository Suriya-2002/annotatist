document.querySelector('.navigation__lines').addEventListener('click', () => {
    document.querySelector('.navigation').classList.toggle('navigation--active');
    document.querySelector('.control-buttons').classList.toggle('control-buttons--shrink');
});
