document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    function activateTab(tabId) {
        tabBtns.forEach(b => {
            const isActive = b.dataset.tab === tabId;
            b.classList.toggle('active', isActive);
        });

        tabContents.forEach(content => {
            const isActive = content.id === tabId;
            content.classList.toggle('active', isActive);
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            if (tabId === 'partners') return;
            activateTab(tabId);
        });
    });

    const initialTab = window.location.hash.replace('#', '') || 'home';
    activateTab(['home', 'code', 'about'].includes(initialTab) ? initialTab : 'home');

    window.addEventListener('hashchange', () => {
        const hashTab = window.location.hash.replace('#', '');
        if (['home', 'code', 'about'].includes(hashTab)) {
            activateTab(hashTab);
        }
    });

    const chartBars = document.querySelectorAll('.chart-bar');
    const chartDetail = document.getElementById('chart-detail');
    const detailScore = chartDetail ? chartDetail.querySelector('.detail-score') : null;
    const detailTitle = chartDetail ? chartDetail.querySelector('.detail-title') : null;
    const detailNote = chartDetail ? chartDetail.querySelector('.detail-note') : null;
    const detailLatency = document.getElementById('detail-latency');
    const detailLoss = document.getElementById('detail-loss');
    const detailBandwidth = document.getElementById('detail-bandwidth');
    let activeIndex = 0;

    function setChartDetail(bar) {
        if (!bar || !chartDetail) return;

        const score = Number(bar.dataset.score || 80);
        const label = bar.dataset.label || '当前';
        const note = bar.dataset.note || '实时状态正常';
        const latency = bar.dataset.latency || '8.2';
        const loss = bar.dataset.loss || '0.08';
        const bandwidth = bar.dataset.bandwidth || '14.1';

        if (detailScore) detailScore.textContent = `${score}%`;
        if (detailTitle) detailTitle.textContent = `${label} 运行状态`;
        if (detailNote) detailNote.textContent = note;
        if (detailLatency) detailLatency.textContent = `时延 ${latency} ms`;
        if (detailLoss) detailLoss.textContent = `丢包 ${loss}%`;
        if (detailBandwidth) detailBandwidth.textContent = `带宽 ${bandwidth} Mbps`;

        chartBars.forEach(item => item.classList.remove('active'));
        bar.classList.add('active');
    }

    chartBars.forEach((bar, index) => {
        bar.addEventListener('click', () => {
            activeIndex = index;
            setChartDetail(bar);
        });
        bar.style.setProperty('--value', bar.dataset.score || 60);
    });

    if (chartBars.length > 0) {
        setChartDetail(chartBars[0]);

        setInterval(() => {
            activeIndex = (activeIndex + 1) % chartBars.length;

            chartBars.forEach((bar, index) => {
                const base = 78 + Math.sin(Date.now() / 900 + index * 0.8) * 10 + Math.cos(Date.now() / 1300 + index) * 5;
                const score = Math.max(72, Math.min(99, Math.round(base + index * 1.5)));
                const latency = (7 + Math.abs(Math.sin(Date.now() / 1000 + index * 0.4)) * 3.8 + Math.random() * 0.6).toFixed(1);
                const loss = (0.03 + Math.abs(Math.sin(Date.now() / 1400 + index * 0.7)) * 0.14).toFixed(2);
                const bandwidth = (10.5 + Math.cos(Date.now() / 1200 + index * 0.5) * 3.2 + Math.random() * 0.8).toFixed(1);

                bar.dataset.score = String(score);
                bar.dataset.latency = String(latency);
                bar.dataset.loss = String(loss);
                bar.dataset.bandwidth = String(bandwidth);
                bar.dataset.label = bar.querySelector('.chart-time')?.textContent || `当前`;
                bar.dataset.note = `时延 ${latency} ms · 丢包 ${loss}%`;
                bar.style.setProperty('--value', String(score));
            });

            setChartDetail(chartBars[activeIndex]);
        }, 1600);
    }
});
