/**
 * 生日邀请函交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    const hotelLat = 29.6168;
    const hotelLng = 106.5558;
    const hotelName = "锦禧大酒楼(重庆悦荟购物中心店)";
    const hotelAddress = "重庆市两江新区红盛路37号 重庆悦荟购物中心 L4 层";

    initNavigation(hotelLat, hotelLng, hotelName, hotelAddress);
    initAddressClick(hotelLat, hotelLng, hotelName, hotelAddress);
    initCalendarEvent();
});

/**
 * 初始化导航功能
 * @param {number} lat - 酒店纬度
 * @param {number} lng - 酒店经度
 * @param {string} name - 酒店名称
 * @param {string} address - 酒店地址
 */
function initNavigation(lat, lng, name, address) {
    const navBtn = document.getElementById('navBtn');

    navBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openMapNavigation(lat, lng, name, address);
    });
}

/**
 * 初始化地址点击导航
 * @param {number} lat - 酒店纬度
 * @param {number} lng - 酒店经度
 * @param {string} name - 酒店名称
 * @param {string} address - 酒店地址
 */
function initAddressClick(lat, lng, name, address) {
    const addressItem = document.getElementById('addressItem');
    
    addressItem.addEventListener('click', function(e) {
        e.stopPropagation();
        openMapNavigation(lat, lng, name, address);
    });
    
    addressItem.style.cursor = 'pointer';
}

/**
 * 打开地图导航
 * @param {number} lat - 酒店纬度
 * @param {number} lng - 酒店经度
 * @param {string} name - 酒店名称
 * @param {string} address - 酒店地址
 */
function openMapNavigation(lat, lng, name, address) {
    if (isWeChatBrowser()) {
        openWeChatMap(lat, lng, name, address);
    } else {
        showMapSelector(lat, lng, name, address);
    }
}

/**
 * 微信环境下的地图导航
 * @param {number} lat - 酒店纬度
 * @param {number} lng - 酒店经度
 * @param {string} name - 酒店名称
 * @param {string} address - 酒店地址
 */
function openWeChatMap(lat, lng, name, address) {
    if (typeof wx !== 'undefined' && wx.openLocation) {
        wx.openLocation({
            latitude: lat,
            longitude: lng,
            name: name,
            address: address,
            scale: 16
        });
    } else {
        const tencentUrl = `https://map.qq.com/mobile/routeplan/index.html?type=drive&from=我的位置&to=${encodeURIComponent(name)}&tocoord=${lng},${lat}`;
        window.location.href = tencentUrl;
    }
}

/**
 * 检测是否为微信浏览器
 */
function isWeChatBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
}

/**
 * 显示地图选择器
 * @param {number} lat - 酒店纬度
 * @param {number} lng - 酒店经度
 * @param {string} name - 酒店名称
 * @param {string} address - 酒店地址
 */
function showMapSelector(lat, lng, name, address) {
    const existingSelector = document.querySelector('.map-selector-overlay');
    if (existingSelector) {
        existingSelector.remove();
    }

    const tencentUrl = `https://map.qq.com/mobile/routeplan/index.html?type=drive&from=我的位置&to=${encodeURIComponent(name)}&tocoord=${lng},${lat}`;
    const amapUrl = `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}&callnative=0`;
    const baiduUrl = `https://api.map.baidu.com/marker?location=${lat},${lng}&title=${encodeURIComponent(name)}&content=${encodeURIComponent(address)}&output=html`;

    const selectorHTML = `
        <div class="map-selector-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:1000;">
            <div style="background:#fff;border-radius:16px;padding:24px;width:85%;max-width:320px;">
                <h3 style="text-align:center;font-size:18px;font-weight:bold;margin-bottom:20px;color:#333;">选择导航方式</h3>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <a href="${tencentUrl}" target="_blank" style="display:block;padding:15px 20px;background:#1E90FF;color:#fff;text-align:center;border-radius:8px;text-decoration:none;font-size:16px;">腾讯地图</a>
                    <a href="${amapUrl}" target="_blank" style="display:block;padding:15px 20px;background:#00BFFF;color:#fff;text-align:center;border-radius:8px;text-decoration:none;font-size:16px;">高德地图</a>
                    <a href="${baiduUrl}" target="_blank" style="display:block;padding:15px 20px;background:#333;color:#fff;text-align:center;border-radius:8px;text-decoration:none;font-size:16px;">百度地图</a>
                </div>
                <button onclick="document.querySelector('.map-selector-overlay').remove()" style="margin-top:20px;width:100%;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:16px;cursor:pointer;">取消</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', selectorHTML);
}

/**
 * 初始化日历事件添加功能
 */
function initCalendarEvent() {
    const timeItem = document.getElementById('timeItem');
    
    timeItem.addEventListener('click', function(e) {
        e.stopPropagation();
        showCalendarOptions();
    });
    
    timeItem.style.cursor = 'pointer';
}

/**
 * 显示日历选项
 */
function showCalendarOptions() {
    const existingSelector = document.querySelector('.calendar-selector-overlay');
    if (existingSelector) {
        existingSelector.remove();
    }

    const icsUrl = generateICSFile();

    const selectorHTML = `
        <div class="calendar-selector-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:1000;">
            <div style="background:#fff;border-radius:16px;padding:24px;width:85%;max-width:320px;">
                <h3 style="text-align:center;font-size:18px;font-weight:bold;margin-bottom:20px;color:#333;">添加到日历</h3>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <a href="${icsUrl}" download="birthday-invite.ics" style="display:block;padding:15px 20px;background:#d92121;color:#fff;text-align:center;border-radius:8px;text-decoration:none;font-size:16px;">下载日历文件</a>
                    <button onclick="copyEventText()" style="display:block;padding:15px 20px;background:#666;color:#fff;text-align:center;border:none;border-radius:8px;font-size:16px;cursor:pointer;">复制活动信息</button>
                </div>
                <button onclick="document.querySelector('.calendar-selector-overlay').remove()" style="margin-top:20px;width:100%;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:16px;cursor:pointer;">取消</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', selectorHTML);
}

/**
 * 生成ICS日历文件
 */
function generateICSFile() {
    const eventData = {
        title: '刘浪四十岁生日宴会',
        description: '诚邀您参加刘浪的四十岁生日宴会',
        location: '重庆市两江新区红盛路37号 重庆悦荟购物中心 L4 层 锦禧大酒楼',
        startTime: '20260530T040000Z',
        endTime: '20260530T080000Z',
        organizer: '刘浪',
        contact: '18523105015'
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Birthday Invite//CN
BEGIN:VEVENT
DTSTART:${eventData.startTime}
DTEND:${eventData.endTime}
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}\\n联系人：${eventData.organizer}\\n电话：${eventData.contact}
LOCATION:${eventData.location}
UID:birthday-invite-20260530@example.com
DTSTAMP:20260506T000000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
}

/**
 * 复制活动信息
 */
function copyEventText() {
    const eventText = `【生日宴会邀请】
时间：2026年5月30日 星期六 中午12:00
地点：重庆市两江新区红盛路37号 重庆悦荟购物中心 L4 层 锦禧大酒楼
联系人：刘浪
电话：18523105015`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(eventText).then(function() {
            alert('活动信息已复制！');
        }).catch(function() {
            fallbackCopyText(eventText);
        });
    } else {
        fallbackCopyText(eventText);
    }
}

/**
 * 备用复制方法
 */
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        alert('活动信息已复制！');
    } catch (err) {
        alert('复制失败，请手动选择复制');
    }

    document.body.removeChild(textArea);
}
