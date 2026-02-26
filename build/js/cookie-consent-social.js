document.querySelectorAll('[data-src][data-cookiecategory="social"]').forEach(function (el) {
    el.setAttribute('src', el.dataset.src);
    delete el.dataset.src;
});
document.querySelectorAll('[data-cookie-placeholder]').forEach(function (el) {
    el.removeAttribute('data-cookie-placeholder');
});
