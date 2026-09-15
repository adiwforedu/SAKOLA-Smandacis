/**
 * gas-config.js
 * Konfigurasi koneksi ke Google Apps Script Web App
 * untuk Aplikasi Monitoring Adiwiyata SMAN 2 Ciamis
 */

(function () {
    const GAS_URL_KEY = 'adiwiyata_gas_url';
    const GAS_SYNC_STATUS_KEY = 'adiwiyata_gas_sync';

    window.gasConfig = {
        get webAppUrl() {
            return localStorage.getItem(GAS_URL_KEY) || '';
        },
        set webAppUrl(url) {
            if (url && url.trim()) {
                localStorage.setItem(GAS_URL_KEY, url.trim());
            } else {
                localStorage.removeItem(GAS_URL_KEY);
            }
        },
        isConfigured() {
            const url = this.webAppUrl;
            return url && url.startsWith('https://script.google.com/macros/s/');
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

    // ─── UI Panel Pengaturan Koneksi ─────────────────────────────────────────
    window.gasConfig.renderSettingsPanel = function () {
        const existing = document.getElementById('gasSettingsPanel');
        if (existing) {
            existing.classList.toggle('hidden');
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'gasSettingsPanel';
        panel.className = 'gas-settings-panel glass';
        panel.innerHTML = `
            <div class="gas-panel-header">
                <h4><i class="fas fa-database"></i> Pengaturan Koneksi Database</h4>
                <button class="close-btn" onclick="document.getElementById('gasSettingsPanel').classList.add('hidden')" type="button"><i class="fas fa-times"></i></button>
            </div>
            <div class="gas-panel-body">
                <p style="font-size:0.85rem; color:var(--color-text-muted); margin-bottom:12px;">
                    Hubungkan aplikasi ke Google Spreadsheet melalui Google Apps Script Web App.
                </p>
                <div class="form-group">
                    <label style="font-size:0.85rem;">URL Google Apps Script Web App</label>
                    <input type="url" id="gasUrlInput" class="form-control" 
                        placeholder="https://script.google.com/macros/s/..." 
                        value="${window.gasConfig.webAppUrl}"
                        style="font-size:0.8rem; font-family: monospace;">
                </div>
                <div id="gasTestResult" style="display:none; padding:10px; border-radius:8px; margin-bottom:10px; font-size:0.85rem;"></div>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button class="btn btn-secondary" id="gasTestBtn" onclick="window.gasConfig._testFromUI()">
                        <i class="fas fa-plug"></i> Test Koneksi
                    </button>
                    <button class="btn btn-primary" onclick="window.gasConfig._saveFromUI()">
                        <i class="fas fa-save"></i> Simpan
                    </button>
                    <button class="btn btn-outline" onclick="window.gasConfig._clearUrl()" style="color:#ef4444; border-color:#ef4444;">
                        <i class="fas fa-unlink"></i> Hapus Koneksi
                    </button>
                </div>
                <hr style="margin:16px 0; border-color:rgba(255,255,255,0.1);">
                <details style="font-size:0.82rem; color:var(--color-text-muted);">
                    <summary style="cursor:pointer; font-weight:600; margin-bottom:8px;">📋 Cara mendapatkan URL (klik untuk lihat)</summary>
                    <ol style="padding-left:18px; line-height:1.8;">
                        <li>Buka <a href="https://script.google.com" target="_blank" style="color:var(--color-primary);">script.google.com</a> → Proyek Baru</li>
                        <li>Paste isi file <strong>Code.gs</strong> → Simpan</li>
                        <li>Klik Run → pilih <strong>initSheets()</strong> → izinkan akses</li>
                        <li>Deploy → New Deployment → Web App</li>
                        <li>Execute as: <strong>Me</strong> | Access: <strong>Anyone</strong></li>
                        <li>Copy URL dan paste di kolom di atas</li>
                    </ol>
                </details>
            </div>
        `;

        document.body.appendChild(panel);
    };

    window.gasConfig._testFromUI = async function () {
        const input = document.getElementById('gasUrlInput');
        const result = document.getElementById('gasTestResult');
        const btn = document.getElementById('gasTestBtn');
        if (!input || !result) return;

        const url = input.value.trim();
        window.gasConfig.webAppUrl = url;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        result.style.display = 'block';
        result.style.background = 'rgba(234,179,8,0.1)';
        result.style.border = '1px solid rgba(234,179,8,0.3)';
        result.innerHTML = '⏳ Menghubungkan ke database...';

        const res = await window.gasConfig.testConnection();

        if (res.ok) {
            result.style.background = 'rgba(16,185,129,0.1)';
            result.style.border = '1px solid rgba(16,185,129,0.3)';
            result.innerHTML = '✅ ' + res.message;
        } else {
            result.style.background = 'rgba(239,68,68,0.1)';
            result.style.border = '1px solid rgba(239,68,68,0.3)';
            result.innerHTML = '❌ ' + res.message;
        }
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plug"></i> Test Koneksi';
    };

    window.gasConfig._saveFromUI = function () {
        const input = document.getElementById('gasUrlInput');
        if (!input) return;
        window.gasConfig.webAppUrl = input.value.trim();
        Swal.fire({
            icon: 'success', title: 'Tersimpan',
            text: 'URL database berhasil disimpan. Halaman akan dimuat ulang.',
            timer: 2000, showConfirmButton: false,
            background: 'rgba(30,41,59,0.95)', color: '#f8fafc'
        }).then(() => location.reload());
    };

    window.gasConfig._clearUrl = function () {
        window.gasConfig.webAppUrl = '';
        const input = document.getElementById('gasUrlInput');
        if (input) input.value = '';
        setSyncStatus('idle');
        Swal.fire({
            icon: 'info', title: 'Koneksi Dihapus',
            text: 'Aplikasi sekarang berjalan dalam mode offline (localStorage).',
            timer: 2000, showConfirmButton: false,
            background: 'rgba(30,41,59,0.95)', color: '#f8fafc'
        });
    };

    // Inisialisasi status indikator saat load
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.gasConfig.isConfigured()) {
            setSyncStatus('idle');
        }
    });

})();
