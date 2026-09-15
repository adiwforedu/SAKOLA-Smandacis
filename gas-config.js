/**
 * gas-config.js
 * Konfigurasi koneksi ke Google Apps Script Web App
 * untuk Aplikasi Monitoring Adiwiyata SMAN 2 Ciamis
 */

(function () {
    const GAS_URL_KEY = 'adiwiyata_gas_url';
    const GAS_SYNC_STATUS_KEY = 'adiwiyata_gas_sync';

    // Ganti teks di bawah ini dengan URL Web App Anda (pastikan diapit tanda kutip tunggal)
    const HARDCODED_GAS_URL = 'https://script.google.com/macros/s/AKfycbwr9RxhLtc4nU3IlXkY6sLpMjINDmFDJSK1_dgy70TMRZjnJ84db9C0dvdBf2ORts5A/exec';

    window.gasConfig = {
        get webAppUrl() {
            return HARDCODED_GAS_URL;
        },
        set webAppUrl(url) {
            // Read-only, tidak perlu update localStorage
        },
        isConfigured() {
            return this.webAppUrl && this.webAppUrl.startsWith('https://script.google.com/macros/s/');
        }
    };

    // ─── Sync Status Indicator ────────────────────────────────────────────────
    function setSyncStatus(status) {
        // status: 'online' | 'offline' | 'syncing' | 'error'
        localStorage.setItem(GAS_SYNC_STATUS_KEY, status);
        const el = document.getElementById('gasSyncIndicator');
        if (!el) return;

        const configs = {
            online:  { icon: '🟢', text: 'Tersinkron',    cls: 'sync-online'  },
            offline: { icon: '🔴', text: 'Offline',        cls: 'sync-offline' },
            syncing: { icon: '🟡', text: 'Menyinkron...', cls: 'sync-syncing' },
            error:   { icon: '🔴', text: 'Gagal Sync',    cls: 'sync-error'   },
            idle:    { icon: '⚪', text: 'Belum Terhubung', cls: 'sync-idle'  }
        };
        const cfg = configs[status] || configs.idle;

        el.className = 'sync-indicator ' + cfg.cls;
        el.innerHTML = `<span class="sync-dot"></span><span class="sync-text">${cfg.text}</span>`;
        el.title = `Status Database: ${cfg.text}`;
    }

    window.gasConfig.setSyncStatus = setSyncStatus;
    window.gasConfig.getSyncStatus = () => localStorage.getItem(GAS_SYNC_STATUS_KEY) || 'idle';

    // ─── Test Koneksi ─────────────────────────────────────────────────────────
    window.gasConfig.testConnection = async function () {
        const url = this.webAppUrl;
        if (!url) {
            setSyncStatus('idle');
            return { ok: false, message: 'URL belum diisi.' };
        }
        setSyncStatus('syncing');
        try {
            const res = await fetch(url + '?action=ping', { signal: AbortSignal.timeout(8000) });
            const json = await res.json();
            if (json && json.status === 'ok') {
                setSyncStatus('online');
                return { ok: true, message: 'Koneksi berhasil! Database terhubung.' };
            } else {
                setSyncStatus('error');
                return { ok: false, message: 'Respons tidak valid dari GAS.' };
            }
        } catch (err) {
            setSyncStatus('error');
            return { ok: false, message: 'Koneksi gagal: ' + err.message };
        }
    };

    // ─── Load Menu Dinamis dari GAS ───────────────────────────────────────────
    window.gasConfig.loadMenuConfig = async function () {
        if (!this.isConfigured()) return null;
        try {
            const res = await fetch(this.webAppUrl + '?action=getMenuConfig', {
                signal: AbortSignal.timeout(10000)
            });
            const json = await res.json();
            if (json && json.status === 'success' && Array.isArray(json.data)) {
                localStorage.setItem('adiwiyata_menu_config', JSON.stringify(json.data));
                return json.data;
            }
        } catch (_) {}
        // Fallback ke cache lokal
        const cached = localStorage.getItem('adiwiyata_menu_config');
        return cached ? JSON.parse(cached) : null;
    };

    // ─── Verifikasi Password via GAS ─────────────────────────────────────────
    window.gasConfig.verifyPassword = async function (type, password) {
        if (!this.isConfigured()) return null; // null = tidak bisa verifikasi (offline)
        try {
            const res = await fetch(this.webAppUrl + '?action=verifyPassword&type=' + encodeURIComponent(type) + '&pwd=' + encodeURIComponent(password), {
                signal: AbortSignal.timeout(8000)
            });
            const json = await res.json();
            return json && json.status === 'success' ? json.match : false;
        } catch (_) {
            return null; // null berarti GAS tidak bisa dihubungi → fallback ke lokal
        }
    };

    // ─── UI Panel Pengaturan Koneksi (Dinonaktifkan) ─────────────────────────
    window.gasConfig.renderSettingsPanel = function () {
        // Karena koneksi sudah hardcoded, panel ini tidak diperlukan lagi.
        console.log("Pengaturan koneksi dinonaktifkan karena URL sudah di-hardcode.");
    };

    window.gasConfig._testFromUI = async function () {};
    window.gasConfig._saveFromUI = function () {};
    window.gasConfig._clearUrl = function () {};

    // Inisialisasi status indikator saat load
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.gasConfig.isConfigured()) {
            setSyncStatus('idle');
        }
    });

})();
