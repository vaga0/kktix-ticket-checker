(function() {
    'use strict';
    const hideSoldout = true;
    var starttime = new Date().getTime();

    const observer = new MutationObserver(() => {
        const target = document.querySelector('.ticket-quantity');
        if (target) {
            observer.disconnect(); // 停止監聽
            var endtime = new Date().getTime();
            console.log(endtime + ': 🎯 目標元素出現');
            console.log("差幾秒" + (endtime - starttime))
            checkTickets()
        }
    });

    const hideSoldoutTicket = () => {
        if (!hideSoldout) return;

        document.querySelectorAll('.ticket-quantity.ng-binding.ng-scope').forEach(el => {
        const ticketUnit = el.closest('.ticket-unit.ng-scope');
        if (ticketUnit) {
            ticketUnit.style.display = 'none';
        }
        });
    }

    const checkTickets = () => {
        const allTickets = document.querySelectorAll('.ticket-unit').length;
        const soldOutTickets = document.querySelectorAll('.ticket-quantity.ng-binding.ng-scope').length;
        const availableTickets = document.querySelectorAll('.ticket-quantity.ng-scope:not(.ng-binding)').length;


        if (allTickets === 0) {
            console.warn('沒有展示任何票位？？');
        } else if (allTickets - soldOutTickets <= 0) {
            console.warn('全部票位已售完！');
        } else if ((allTickets - soldOutTickets) !== availableTickets) {
            console.warn('票位數量不一致！？');
        } else {
            console.log("🎉 有票可買！播放提示音！");
            fetch('http://localhost:8080');
            hideSoldoutTicket();
            return;
        }

        // 上述任一條件不符 → 重新整理
        const delay = Math.floor(Math.random() * 2000) + 1000;
        console.warn(delay + '毫秒後重新整理');
        setTimeout(() => location.reload(), delay);
    };

    console.log(starttime + ': Start waitting...');
    observer.observe(document.body, { childList: true, subtree: true });
})();
