// Mengambil konfigurasi GAS dari window (yang di-set oleh gas-config.js)
const { gasConfig } = window;

// --- Fasilitas Standar SMAN 2 Ciamis ---
const DEFAULT_FACILITIES = [
    "Ruang Guru", "Ruang Kepala Sekolah", "Ruang TU", "Aula", "Kantin", "GOR", "Mesjid", "Perpustakaan", "UKS",
    "Lab Komputer 1", "Lab Komputer 2", "Lab Komputer 3", "Lab Biologi", "Lab Kimia", "Lab Fisika",
    "Lapang Upacara", "Lapang Tenis", "Lapang Basket", "Lapang Voli",

    "X E-1", "X E-2", "X E-3", "X E-4", "X E-5", "X E-6",
    "X E-7", "X E-8", "X E-9", "X E-10", "X E-11", "X E-12",

    "XI F-1", "XI F-2", "XI F-3", "XI F-4", "XI F-5", "XI F-6",
    "XI F-7", "XI F-8", "XI F-9", "XI F-10", "XI F-11", "XI F-12",

    "XII F-1", "XII F-2", "XII F-3", "XII F-4", "XII F-5", "XII F-6",
    "XII F-7", "XII F-8", "XII F-9", "XII F-10", "XII F-11", "XII F-12"
];

// --- Default Data Histori (Jadwal, Kendaraan, Pengaduan, Fasilitas) ---
const DEFAULT_EVENTS = [
    {
        id: "zh6lEeaFqT8UzFT7Sxi9",
        title: "Sosialisasi Taspen Guru dan Tenaga Kependidikan",
        date: "2026-07-31",
        endDate: null,
        time: "13.45 - 15.00",
        facility: ["Ruang Guru"],
        organizer: "Taspen Tasikmalaya",
        cp: "Pak Anton Pamungkas",
        technical: "Sound sytem, Proyektor, Kursi Peserta ",
        participants: "70",
        committee: "",
        nomorSurat: ""
    }
];

const DEFAULT_VEHICLES = [
    {
        id: "AUeHjZQ6u3K4RBFrjBEy",
        name: "ISUZU NLR 55B LX",
        plate: "Z 7204 TA",
        type: "Mobil",
        status: "Perlu Perbaikan",
        km: 39022,
        lastOilDate: "2026-08-14",
        taxDate: "2027-07-05",
        plateDate: "2027-07-05",
        notes: "Panel odo meter berkedip periodik, Ban belakang perlu diganti, tuas transmisi perlu perbaikan"
    },
    {
        id: "tzC7Oe3aCT8cQrrasosF",
        name: "AVANZA",
        plate: "Z 1190 TK",
        type: "Mobil",
        status: "Perlu Perbaikan",
        km: 68741,
        kmNextOil: 73065,
        lastOilDate: "2026-06-13",
        taxDate: "2027-07-15",
        plateDate: "2031-07-15",
        notes: "Ban perlu diganti, kopling perbaikan/diganti, steering (spooring/balancing)"
    }
];

const DEFAULT_COMPLAINTS = [
    {
        id: "sample_waste_1",
        reporter: "Siswa 1",
        role: "Siswa",
        contact: "",
        location: "Ruang Kelas XII F-2",
        category: "Sampah Plastik Bercampur",
        desc: "Banyak botol plastik di tempat sampah kertas",
        status: "Pending",
        response: "",
        createdAt: new Date().toISOString()
    },
    {
        id: "sample_waste_2",
        reporter: "Guru Piket",
        role: "Guru",
        contact: "",
        location: "Perpustakaan",
        category: "Tempat Sampah Penuh",
        desc: "Tempat sampah depan perpustakaan sudah penuh dan berserakan",
        status: "Pending",
        response: "",
        createdAt: new Date().toISOString()
    }
];

// --- Default Barang Habis Pakai ---
const DEFAULT_CONSUMABLES = [
    { id: 'c1', name: 'Kertas HVS A4 80gr', category: 'ATK', stock: 25, minStock: 5, unit: 'Rim', location: 'Gudang Sarpras' },
    { id: 'c2', name: 'Spidol Boardmarker Hitam', category: 'ATK', stock: 15, minStock: 5, unit: 'Pcs', location: 'Gudang Sarpras' },
    { id: 'c3', name: 'Pembersih Lantai 4L', category: 'Kebersihan', stock: 8, minStock: 2, unit: 'Galon', location: 'Gudang Kebersihan' },
    { id: 'c4', name: 'Bola Lampu LED 15W', category: 'Kelistrikan', stock: 10, minStock: 3, unit: 'Pcs', location: 'Gudang Kelistrikan' }
];

// --- State Management ---
let isAdmin = false;
let isOperator = false;
let events = [...DEFAULT_EVENTS];
let facilities = [...DEFAULT_FACILITIES];
let vehicles = [...DEFAULT_VEHICLES];
let complaints = [...DEFAULT_COMPLAINTS];
let consumables = [...DEFAULT_CONSUMABLES];
let consumableLogs = [];
let currentComplaintStatusFilter = "all";
let facilityChoices = null; // Instance for Choices.js
let cmsContent = {
    headerTitle: "SAKOLA - SMAN 2 CIAMIS",
    headerSubtitle: "Sistem Analisis Kendali Orientasi Lingkungan Adiwiyata",
    mainHeading: "Jadwal Penggunaan Mendatang",
    footerText: "© 2026 SMAN 2 Ciamis. All rights reserved."
};

let kopSuratConfig = {
    govName: "PEMERINTAH PROVINSI JAWA BARAT",
    deptName: "DINAS PENDIDIKAN",
    schoolName: "SMAN 2 CIAMIS",
    subTitle: "",
    address: "Jl. KH. Ahmad Dahlan No. 2, Ciamis - Jawa Barat 46211",
    contact: "Website: www.sman2ciamis.sch.id | Email: sman2ciamis@yahoo.co.id",
    principalTitle: "Kepala SMAN 2 Ciamis",
    principalName: "Drs. H. Nurdin, M.Pd.",
    principalNip: "19670101 199203 1 005",
    staffTitle: "Ketua Adiwiyata",
    staffName: "H. Endang Rahmat, S.Pd., M.Pd.",
    staffNip: "-"
};

// --- LocalStorage Keys ---
const LOCAL_STORAGE_KEYS = {
    facilities: 'sardas_facilities',
    mapCoordinates: 'sardas_mapCoordinates'
};

let mapCoordinates = {};
let isGasAvailable = false;
let consumablesViewMode = 'table';
let consumablesStockFilter = 'all';

function loadFacilitiesFromLocalStorage() {
    const ls = localStorage.getItem(LOCAL_STORAGE_KEYS.facilities);
    if (ls) {
        try {
            const parsed = JSON.parse(ls);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (err) {
            console.warn('Gagal mengurai localStorage fasilitas:', err);
        }
    }
    return null;
}

function loadMapCoordinatesFromLocalStorage() {
    const ls = localStorage.getItem(LOCAL_STORAGE_KEYS.mapCoordinates);
    if (ls) {
        try {
            const parsed = JSON.parse(ls);
            if (parsed && typeof parsed === 'object' && parsed.coords && typeof parsed.coords === 'object') {
                return parsed.coords;
            }
        } catch (err) {
            console.warn('Gagal mengurai localStorage koordinat denah:', err);
        }
    }
    return null;
}

// --- DOM Elements ---
const DOM = {
    adminLoginBtn: document.getElementById('adminLoginBtn'),
    adminLogoutBtn: document.getElementById('adminLogoutBtn'),
    adminActions: document.getElementById('adminActions'),
    loginModal: document.getElementById('loginModal'),
    closeLoginModal: document.getElementById('closeLoginModal'),
    loginSubmitBtn: document.getElementById('loginSubmitBtn'),
    adminPassword: document.getElementById('adminPassword'),

    eventsGrid: document.getElementById('eventsGrid'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    searchInput: document.getElementById('searchInput'),

    detailPanel: document.getElementById('detailPanel'),
    panelOverlay: document.getElementById('panelOverlay'),
    closeDetailBtn: document.getElementById('closeDetailBtn'),
    mapWrapper: document.getElementById('mapWrapper'),

    addEventBtn: document.getElementById('addEventBtn'),
    eventModal: document.getElementById('eventModal'),
    closeEventModal: document.getElementById('closeEventModal'),
    cancelEventBtn: document.getElementById('cancelEventBtn'),
    eventForm: document.getElementById('eventForm'),

    manageFacilitiesBtn: document.getElementById('manageFacilitiesBtn'),
    facilitiesModal: document.getElementById('facilitiesModal'),
    closeFacilitiesModal: document.getElementById('closeFacilitiesModal'),
    facilitiesList: document.getElementById('facilitiesList'),
    addFacilityBtn: document.getElementById('addFacilityBtn'),
    newFacilityName: document.getElementById('newFacilityName'),
    eventFacility: document.getElementById('eventFacility'),
    importFacilityBtn: document.getElementById('importFacilityBtn'),
    csvFacilityInput: document.getElementById('csvFacilityInput'),

    mapEditorBtn: document.getElementById('mapEditorBtn'),
    mapEditorModal: document.getElementById('mapEditorModal'),
    closeMapEditorModal: document.getElementById('closeMapEditorModal'),
    editorFacilitySelect: document.getElementById('editorFacilitySelect'),
    saveMapCoordsBtn: document.getElementById('saveMapCoordsBtn'),
    deleteMapCoordsBtn: document.getElementById('deleteMapCoordsBtn'),
    cleanOrphanCoordsBtn: document.getElementById('cleanOrphanCoordsBtn'),
    mapEditorWrapper: document.getElementById('mapEditorWrapper'),
    editableHighlight: document.getElementById('editableHighlight'),
    quickAddFacilityInput: document.getElementById('quickAddFacilityInput'),
    quickAddFacilityBtn: document.getElementById('quickAddFacilityBtn'),

    // Modul Kendaraan DOM
    tabHompimpahBtn: document.getElementById('tabHompimpahBtn'),
    tabComplaintsBtn: document.getElementById('tabHompimpahBtn'), // alias
    tabNadiHijauBtn: document.getElementById('tabNadiHijauBtn'),
    complaintsSection: document.getElementById('complaintsSection'),
    nadiHijauSection: document.getElementById('nadiHijauSection'),
    nadiHijauSection: document.getElementById('nadiHijauSection'),
    vehicleSearchInput: document.getElementById('vehicleSearchInput'),
    adminVehicleActions: document.getElementById('adminVehicleActions'),
    addVehicleBtn: document.getElementById('addVehicleBtn'),
    vehicleAlertBanner: document.getElementById('vehicleAlertBanner'),
    vehiclesGrid: document.getElementById('vehiclesGrid'),
    vehicleModal: document.getElementById('vehicleModal'),
    closeVehicleModal: document.getElementById('closeVehicleModal'),
    cancelVehicleBtn: document.getElementById('cancelVehicleBtn'),
    vehicleForm: document.getElementById('vehicleForm'),

    // Modul Pengaduan DOM
    complaintSearchInput: document.getElementById('complaintSearchInput'),
    addComplaintBtn: document.getElementById('addComplaintBtn'),
    complaintsGrid: document.getElementById('complaintsGrid'),
    complaintsMapWrapper: document.getElementById('complaintsMapWrapper'),
    complaintModal: document.getElementById('complaintModal'),
    closeComplaintModal: document.getElementById('closeComplaintModal'),
    cancelComplaintBtn: document.getElementById('cancelComplaintBtn'),
    complaintForm: document.getElementById('complaintForm'),
    complaintAdminModal: document.getElementById('complaintAdminModal'),
    closeComplaintAdminModal: document.getElementById('closeComplaintAdminModal'),
    cancelComplaintAdminBtn: document.getElementById('cancelComplaintAdminBtn'),
    complaintAdminForm: document.getElementById('complaintAdminForm'),

    // Modul Barang Habis Pakai DOM
    statTotalConsumables: document.getElementById('statTotalConsumables'),
    statLowStockConsumables: document.getElementById('statLowStockConsumables'),
    statTotalMutations: document.getElementById('statTotalMutations'),
    consumableSearchInput: document.getElementById('consumableSearchInput'),
    consumableCategoryFilter: document.getElementById('consumableCategoryFilter'),
    openPublicMultiOutBtn: document.getElementById('openPublicMultiOutBtn'),
    adminConsumableActions: document.getElementById('adminConsumableActions'),
    addConsumableItemBtn: document.getElementById('addConsumableItemBtn'),
    adminRestockBtn: document.getElementById('adminRestockBtn'),
    viewConsumableHistoryBtn: document.getElementById('viewConsumableHistoryBtn'),
    consumablesGrid: document.getElementById('consumablesGrid'),

    publicMultiOutModal: document.getElementById('publicMultiOutModal'),
    closePublicMultiOutModal: document.getElementById('closePublicMultiOutModal'),
    cancelPublicMultiOutBtn: document.getElementById('cancelPublicMultiOutBtn'),
    publicMultiOutForm: document.getElementById('publicMultiOutForm'),
    consumableItemRowsContainer: document.getElementById('consumableItemRowsContainer'),
    addConsumableRowBtn: document.getElementById('addConsumableRowBtn'),

    adminConsumableModal: document.getElementById('adminConsumableModal'),
    closeAdminConsumableModal: document.getElementById('closeAdminConsumableModal'),
    cancelAdminConsumableBtn: document.getElementById('cancelAdminConsumableBtn'),
    adminConsumableForm: document.getElementById('adminConsumableForm'),

    adminRestockModal: document.getElementById('adminRestockModal'),
    closeAdminRestockModal: document.getElementById('closeAdminRestockModal'),
    cancelAdminRestockBtn: document.getElementById('cancelAdminRestockBtn'),
    adminRestockForm: document.getElementById('adminRestockForm'),

    consumableHistoryModal: document.getElementById('consumableHistoryModal'),
    closeConsumableHistoryModal: document.getElementById('closeConsumableHistoryModal'),
    consumableHistoryTableBody: document.getElementById('consumableHistoryTableBody'),

    cmsEditables: document.querySelectorAll('.cms-editable')
};

// --- Initialization ---
async function init() {
    // 1. Muat cache lokal secara cepat untuk tampilan instan
    loadFromLocalStorage();
    renderApp();

    // 2. Jika GAS dikonfigurasi, muat dari backend Google Apps Script
    if (gasConfig && gasConfig.isConfigured()) {
        await loadFromGAS();
    } else {
        console.info("GAS Web App URL belum dikonfigurasi di gas-config.js. Berjalan dalam mode penyimpanan lokal.");
    }

    setupEventListeners();
    
    // Inisialisasi Date Picker dengan tanggal hari ini
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('quickReportDate')) document.getElementById('quickReportDate').value = today;
    if (document.getElementById('complaintDate')) document.getElementById('complaintDate').value = today;

    if (sessionStorage.getItem('sisarna_admin') === 'true') {
        isAdmin = true;
        isOperator = true;
    } else if (sessionStorage.getItem('sisarna_operator') === 'true') {
        isOperator = true;
        isAdmin = false;
    }
    updateAccessControlUI();
}

// --- Data Fetching (Google Apps Script / LocalStorage) ---
async function loadFromGAS() {
    if (DOM.loadingIndicator) DOM.loadingIndicator.classList.remove('hidden');
    try {
        const response = await fetch(gasConfig.webAppUrl + '?action=getAll');
        const resJson = await response.json();

        if (resJson && resJson.status === 'success' && resJson.data) {
            isGasAvailable = true;
            const data = resJson.data;

            // 1. Events (Smart Merge dengan Histori Default)
            const localEvents = (JSON.parse(localStorage.getItem('sardas_events') || '[]')).filter(e => e && e.id && !e.id.startsWith('ev_'));
            const gasEvents = Array.isArray(data.events) ? data.events.filter(e => e && e.id && !e.id.startsWith('ev_')) : [];
            const mergedEventsMap = new Map();
            [...DEFAULT_EVENTS, ...localEvents, ...gasEvents].forEach(item => {
                if (item && item.id) mergedEventsMap.set(item.id, item);
            });
            events = Array.from(mergedEventsMap.values());
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
            localStorage.setItem('sardas_events', JSON.stringify(events));

            // 2. Vehicles (Smart Merge dengan Histori Default)
            const localVehicles = JSON.parse(localStorage.getItem('sardas_vehicles') || '[]');
            const gasVehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
            const mergedVehiclesMap = new Map();
            [...DEFAULT_VEHICLES, ...localVehicles, ...gasVehicles].forEach(item => {
                if (item && item.id) mergedVehiclesMap.set(item.id, item);
            });
            vehicles = Array.from(mergedVehiclesMap.values());
            localStorage.setItem('sardas_vehicles', JSON.stringify(vehicles));

            // 3. Complaints (Smart Merge dengan Histori Default)
            const localComplaints = JSON.parse(localStorage.getItem('sardas_complaints') || '[]');
            const gasComplaints = Array.isArray(data.complaints) ? data.complaints : [];
            const mergedComplaintsMap = new Map();
            [...DEFAULT_COMPLAINTS, ...gasComplaints, ...localComplaints].forEach(item => {
                if (item && item.id) {
                    const existing = mergedComplaintsMap.get(item.id);
                    if (existing) {
                        mergedComplaintsMap.set(item.id, {
                            ...existing,
                            ...item,
                            reporter: item.reporter || existing.reporter || 'Warga Sekolah',
                            role: item.role || existing.role || 'Siswa',
                            contact: item.contact !== undefined ? item.contact : (existing.contact || ''),
                            location: item.location || existing.location || '-',
                            category: item.category || existing.category || 'Lainnya',
                            desc: item.desc || existing.desc || '-',
                            status: item.status || existing.status || 'Pending',
                            response: item.response !== undefined ? item.response : (existing.response || '')
                        });
                    } else {
                        mergedComplaintsMap.set(item.id, item);
                    }
                }
            });
            complaints = Array.from(mergedComplaintsMap.values());
            complaints.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            localStorage.setItem('sardas_complaints', JSON.stringify(complaints));

            // 4. Consumables (Barang Habis Pakai)
            if (Array.isArray(data.consumables) && data.consumables.length > 0) {
                const localCons = JSON.parse(localStorage.getItem('sardas_consumables') || '[]');
                const mergedConsMap = new Map();
                [...DEFAULT_CONSUMABLES, ...localCons, ...data.consumables].forEach(item => {
                    if (item && item.id) mergedConsMap.set(item.id, item);
                });
                consumables = Array.from(mergedConsMap.values());
                localStorage.setItem('sardas_consumables', JSON.stringify(consumables));
            }

            // 5. Consumable Logs (Riwayat Mutasi)
            if (Array.isArray(data.consumable_logs)) {
                consumableLogs = data.consumable_logs;
                consumableLogs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                localStorage.setItem('sardas_consumable_logs', JSON.stringify(consumableLogs));
            }

            // 6. Facilities (Smart Merge: Kombinasi Default + LocalStorage + GAS)
            const localFacs = loadFacilitiesFromLocalStorage() || [];
            const gasFacs = Array.isArray(data.facilities) ? data.facilities : [];
            const mergedFacSet = new Set([...DEFAULT_FACILITIES, ...localFacs, ...gasFacs]);
            facilities = Array.from(mergedFacSet);
            localStorage.setItem(LOCAL_STORAGE_KEYS.facilities, JSON.stringify(facilities));

            // Jika data di GAS lebih sedikit dari data gabungan, sinkronkan balik ke GAS
            if (gasFacs.length < facilities.length) {
                saveToGAS('facilities', 'facilities', facilities);
            }

            // 7. Settings (CMS Content & Map Coordinates)
            const localMap = loadMapCoordinatesFromLocalStorage() || {};
            let gasMap = {};
            if (data.settings && typeof data.settings === 'object') {
                if (data.settings.cms) {
                    cmsContent = { ...cmsContent, ...data.settings.cms };
                    localStorage.setItem('sardas_cms', JSON.stringify(cmsContent));
                }
                if (data.settings.mapCoordinates && typeof data.settings.mapCoordinates === 'object') {
                    gasMap = data.settings.mapCoordinates.coords || data.settings.mapCoordinates;
                }
                if (data.settings.kopSurat && typeof data.settings.kopSurat === 'object') {
                    kopSuratConfig = { ...kopSuratConfig, ...data.settings.kopSurat };
                    localStorage.setItem('sardas_kop_surat', JSON.stringify(kopSuratConfig));
                }
            }
            mapCoordinates = { ...localMap, ...gasMap };
            localStorage.setItem(LOCAL_STORAGE_KEYS.mapCoordinates, JSON.stringify({ coords: mapCoordinates }));

            if (Object.keys(mapCoordinates).length > Object.keys(gasMap).length) {
                saveToGAS('settings', 'mapCoordinates', { coords: mapCoordinates });
            }
        }
    } catch (err) {
        console.warn("Gagal terhubung ke Google Apps Script Web App:", err);
    } finally {
        if (DOM.loadingIndicator) DOM.loadingIndicator.classList.add('hidden');
        renderApp();
    }
}

function loadFromLocalStorage() {
    const lsEvents = localStorage.getItem('sardas_events');
    const lsFacilities = localStorage.getItem(LOCAL_STORAGE_KEYS.facilities);
    const lsCms = localStorage.getItem('sardas_cms');
    const lsMap = localStorage.getItem(LOCAL_STORAGE_KEYS.mapCoordinates);
    const lsVehicles = localStorage.getItem('sardas_vehicles');
    const lsComplaints = localStorage.getItem('sardas_complaints');
    const lsConsumables = localStorage.getItem('sardas_consumables');
    const lsConsumableLogs = localStorage.getItem('sardas_consumable_logs');
    const lsKop = localStorage.getItem('sardas_kop_surat');

    if (lsKop) {
        try { kopSuratConfig = { ...kopSuratConfig, ...JSON.parse(lsKop) }; } catch (e) { }
    }

    try {
        const rawE = lsEvents ? JSON.parse(lsEvents) : [];
        const parsedE = Array.isArray(rawE) ? rawE.filter(e => e && e.id && !e.id.startsWith('ev_')) : [];
        const mergedMap = new Map();
        [...DEFAULT_EVENTS, ...parsedE].forEach(item => {
            if (item && item.id) mergedMap.set(item.id, item);
        });
        events = Array.from(mergedMap.values());
        localStorage.setItem('sardas_events', JSON.stringify(events));
    } catch (err) {
        console.warn('Gagal parse localStorage events:', err);
    }
    if (lsFacilities) {
        try {
            const parsed = JSON.parse(lsFacilities);
            if (Array.isArray(parsed) && parsed.length > 0) {
                facilities = parsed;
            }
        } catch (err) {
            console.warn('Gagal mengurai localStorage fasilitas:', err);
        }
    }
    if (lsCms) cmsContent = JSON.parse(lsCms);
    if (lsMap) {
        try {
            const parsedMap = JSON.parse(lsMap);
            if (parsedMap && parsedMap.coords) {
                mapCoordinates = parsedMap.coords;
            }
        } catch (err) {
            console.warn('Gagal mengurai localStorage koordinat denah:', err);
        }
    }
    if (lsVehicles) {
        try {
            const parsedV = JSON.parse(lsVehicles);
            if (Array.isArray(parsedV) && parsedV.length > 0) {
                const mergedMap = new Map();
                [...DEFAULT_VEHICLES, ...parsedV].forEach(item => {
                    if (item && item.id) mergedMap.set(item.id, item);
                });
                vehicles = Array.from(mergedMap.values());
            }
        } catch (err) {
            console.warn('Gagal parse localStorage vehicles:', err);
        }
    }
    if (lsComplaints) {
        try {
            const parsedComp = JSON.parse(lsComplaints);
            if (Array.isArray(parsedComp) && parsedComp.length > 0) {
                const mergedMap = new Map();
                [...DEFAULT_COMPLAINTS, ...parsedComp].forEach(item => {
                    if (item && item.id) mergedMap.set(item.id, item);
                });
                complaints = Array.from(mergedMap.values());
            }
        } catch (err) {
            console.warn('Gagal parse localStorage complaints:', err);
        }
    }
    if (lsConsumables) {
        try {
            const parsedC = JSON.parse(lsConsumables);
            if (Array.isArray(parsedC) && parsedC.length > 0) {
                const mergedMap = new Map();
                [...DEFAULT_CONSUMABLES, ...parsedC].forEach(item => {
                    if (item && item.id) mergedMap.set(item.id, item);
                });
                consumables = Array.from(mergedMap.values());
            }
        } catch (err) {
            console.warn('Gagal mengurai localStorage consumables:', err);
        }
    }
    if (lsConsumableLogs) consumableLogs = JSON.parse(lsConsumableLogs);
}

async function saveToDatabase(collectionName, docId, data, isUpdate = false) {
    // 1. Perbarui state lokal & LocalStorage secara seketika (Optimistic Rendering)
    if (collectionName === 'events') {
        if (isUpdate) {
            const index = events.findIndex(e => e.id === docId);
            if (index > -1) events[index] = { ...events[index], ...data };
        } else {
            if (!data.id) data.id = Date.now().toString();
            events.push(data);
        }
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('sardas_events', JSON.stringify(events));
        renderEvents();
    } else if (collectionName === 'vehicles') {
        if (isUpdate) {
            const index = vehicles.findIndex(v => v.id === docId);
            if (index > -1) vehicles[index] = { ...vehicles[index], ...data };
        } else {
            if (!data.id) data.id = Date.now().toString();
            vehicles.push(data);
        }
        localStorage.setItem('sardas_vehicles', JSON.stringify(vehicles));
        renderVehicles();
    } else if (collectionName === 'complaints') {
        if (isUpdate) {
            const index = complaints.findIndex(c => c.id === docId);
            if (index > -1) complaints[index] = { ...complaints[index], ...data };
        } else {
            if (!data.id) data.id = Date.now().toString();
            complaints.unshift(data);
        }
        localStorage.setItem('sardas_complaints', JSON.stringify(complaints));
        renderComplaints();
    } else if (collectionName === 'consumables') {
        if (isUpdate) {
            const index = consumables.findIndex(c => c.id === docId);
            if (index > -1) consumables[index] = { ...consumables[index], ...data };
        } else {
            if (!data.id) data.id = 'c_' + Date.now().toString();
            consumables.push(data);
        }
        localStorage.setItem('sardas_consumables', JSON.stringify(consumables));
        renderConsumables();
    } else if (collectionName === 'consumable_logs') {
        if (!data.id) data.id = 'log_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 4);
        consumableLogs.unshift(data);
        localStorage.setItem('sardas_consumable_logs', JSON.stringify(consumableLogs));
        renderConsumables();
    } else if (collectionName === 'settings') {
        if (docId === 'facilities') {
            facilities = Array.isArray(data) ? data : (data.list || facilities);
            localStorage.setItem(LOCAL_STORAGE_KEYS.facilities, JSON.stringify(facilities));
            renderFacilities();
        } else if (docId === 'cms') {
            cmsContent = data;
            localStorage.setItem('sardas_cms', JSON.stringify(cmsContent));
            applyCmsContent();
        } else if (docId === 'mapCoordinates') {
            mapCoordinates = data.coords || data;
            localStorage.setItem(LOCAL_STORAGE_KEYS.mapCoordinates, JSON.stringify({ coords: mapCoordinates }));
        }
    }

    // 2. Sinkronisasikan ke GAS jika URL sudah dikonfigurasi (Latar belakang non-blocking)
    if (gasConfig && gasConfig.isConfigured()) {
        saveToGAS(collectionName, docId, data, isUpdate).catch(err => {
            console.warn(`Sinkronisasi latar belakang ke GAS gagal untuk ${collectionName}:`, err);
        });
    }
}

async function saveToGAS(collectionName, docId, data, isUpdate = false) {
    try {
        const payload = {
            action: (collectionName === 'settings' || collectionName === 'facilities') ? 'saveSetting' : 'saveDoc',
            collection: collectionName,
            docId: docId,
            data: data,
            isUpdate: isUpdate
        };

        await fetch(gasConfig.webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.warn(`Gagal mengirim data ${collectionName} ke Google Apps Script:`, err);
    }
}

async function deleteFromDatabase(collectionName, docId) {
    // 1. Perbarui state lokal & LocalStorage
    if (collectionName === 'events') {
        events = events.filter(e => e.id !== docId);
        localStorage.setItem('sardas_events', JSON.stringify(events));
        renderEvents();
    } else if (collectionName === 'vehicles') {
        vehicles = vehicles.filter(v => v.id !== docId);
        localStorage.setItem('sardas_vehicles', JSON.stringify(vehicles));
        renderVehicles();
    } else if (collectionName === 'complaints') {
        complaints = complaints.filter(c => c.id !== docId);
        localStorage.setItem('sardas_complaints', JSON.stringify(complaints));
        renderComplaints();
    } else if (collectionName === 'consumables') {
        consumables = consumables.filter(c => c.id !== docId);
        localStorage.setItem('sardas_consumables', JSON.stringify(consumables));
        renderConsumables();
    }

    // 2. Menghapus di GAS
    if (gasConfig && gasConfig.isConfigured()) {
        try {
            await fetch(gasConfig.webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'deleteDoc',
                    collection: collectionName,
                    docId: docId
                })
            });
        } catch (err) {
            console.warn(`Gagal menghapus ${collectionName}/${docId} dari Google Apps Script:`, err);
        }
    }
}


// --- Rendering Logic ---
function renderApp() {
    applyCmsContent();
    renderFacilities();
    renderEvents();
    renderVehicles();
    renderComplaints();
    renderConsumables();
}

// --- Modul Barang Habis Pakai (Consumables) ---
function renderConsumables(filterText = "", filterCategory = "all") {
    // 1. Hitung Statistik
    const totalItems = consumables.length;
    const lowStockItems = consumables.filter(c => Number(c.stock) <= Number(c.minStock)).length;
    const totalMutations = consumableLogs.length;

    if (DOM.statTotalConsumables) DOM.statTotalConsumables.textContent = totalItems;
    if (DOM.statLowStockConsumables) DOM.statLowStockConsumables.textContent = lowStockItems;
    if (DOM.statTotalMutations) DOM.statTotalMutations.textContent = totalMutations;

    // Filter Banner Indicator
    const filterBanner = document.getElementById('activeConsumableFilterBanner');
    if (filterBanner) {
        if (consumablesStockFilter === 'low') {
            filterBanner.classList.remove('hidden');
        } else {
            filterBanner.classList.add('hidden');
        }
    }

    // 2. Filter Barang
    let filtered = [...consumables];
    if (consumablesStockFilter === 'low') {
        filtered = filtered.filter(c => Number(c.stock) <= Number(c.minStock));
    }
    if (filterCategory && filterCategory !== 'all') {
        filtered = filtered.filter(c => (c.category || '').toLowerCase() === filterCategory.toLowerCase());
    }
    if (filterText) {
        const lower = filterText.toLowerCase();
        filtered = filtered.filter(c =>
            (c.name || '').toLowerCase().includes(lower) ||
            (c.location || '').toLowerCase().includes(lower) ||
            (c.category || '').toLowerCase().includes(lower)
        );
    }

    // Handle View Switcher Toggle
    const tableContainer = document.getElementById('consumablesTableContainer');
    const cardContainer = document.getElementById('consumablesCardContainer');
    const tableViewBtn = document.getElementById('consumableTableViewBtn');
    const cardViewBtn = document.getElementById('consumableCardViewBtn');

    if (consumablesViewMode === 'table') {
        if (tableContainer) tableContainer.classList.remove('hidden');
        if (cardContainer) cardContainer.classList.add('hidden');
        if (tableViewBtn) {
            tableViewBtn.classList.add('active');
            tableViewBtn.style.background = 'white';
            tableViewBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
        if (cardViewBtn) {
            cardViewBtn.classList.remove('active');
            cardViewBtn.style.background = 'transparent';
            cardViewBtn.style.boxShadow = 'none';
        }
        renderConsumablesTable(filtered);
    } else {
        if (tableContainer) tableContainer.classList.add('hidden');
        if (cardContainer) cardContainer.classList.remove('hidden');
        if (cardViewBtn) {
            cardViewBtn.classList.add('active');
            cardViewBtn.style.background = 'white';
            cardViewBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
        if (tableViewBtn) {
            tableViewBtn.classList.remove('active');
            tableViewBtn.style.background = 'transparent';
            tableViewBtn.style.boxShadow = 'none';
        }
        renderConsumablesCards(filtered);
    }
}

function renderConsumablesTable(items) {
    const tableBody = document.getElementById('consumablesTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
                    <i class="fas fa-box-open" style="font-size: 2.2rem; margin-bottom: 0.5rem; color: #94a3b8; display: block;"></i>
                    Tidak ada data barang habis pakai ditemukan.
                </td>
            </tr>
        `;
        return;
    }

    items.forEach(item => {
        const isLow = Number(item.stock) <= Number(item.minStock);
        const maxCalc = Math.max(Number(item.stock), Number(item.minStock) * 3, 10);
        const percent = Math.min(100, Math.round((Number(item.stock) / maxCalc) * 100));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding: 12px 16px;">
                <div style="font-weight: 700; color: #0f172a; font-size: 0.92rem;">${item.name}</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Min. Stok: ${item.minStock} ${item.unit || 'Unit'}</div>
            </td>
            <td style="padding: 12px 16px;">
                <span style="font-size: 0.75rem; background: rgba(37,99,235,0.08); color: var(--color-primary); padding: 3px 10px; border-radius: 12px; font-weight: 600; border: 1px solid rgba(37,99,235,0.15);">
                    ${item.category || 'Umum'}
                </span>
            </td>
            <td style="padding: 12px 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="stock-pill ${isLow ? 'low' : 'safe'}">
                        ${isLow ? '<i class="fas fa-exclamation-circle"></i> Stok Kritis' : '<i class="fas fa-check-circle"></i> Stok Aman'} (${item.stock})
                    </span>
                    <div class="stock-progress-track" title="Persentase Stok: ${percent}%">
                        <div class="stock-progress-fill" style="width: ${percent}%; background: ${isLow ? '#e11d48' : '#10b981'};"></div>
                    </div>
                </div>
            </td>
            <td style="padding: 12px 16px; color: #475569; font-weight: 500;">${item.unit || 'Unit'}</td>
            <td style="padding: 12px 16px; color: #475569;">
                <i class="fas fa-map-marker-alt" style="color: var(--color-primary); margin-right: 4px;"></i> ${item.location || 'Gudang Sarpras'}
            </td>
            <td style="padding: 12px 16px; text-align: right;">
                <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                    <button class="btn btn-primary btn-sm btn-take-consumable" data-id="${item.id}" style="padding: 4px 10px; font-size: 0.78rem;">
                        <i class="fas fa-hand-holding"></i> Ambil
                    </button>
                    <div class="admin-only ${isAdmin ? '' : 'hidden'}" style="display: flex; gap: 4px;">
                        <button class="action-icon edit-consumable btn-sm" data-id="${item.id}" title="Edit Barang"><i class="fas fa-edit"></i></button>
                        <button class="action-icon delete delete-consumable btn-sm" data-id="${item.id}" title="Hapus Barang"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </td>
        `;

        tr.querySelector('.btn-take-consumable').addEventListener('click', () => {
            openPublicMultiOutModal(item.id);
        });

        const editBtn = tr.querySelector('.edit-consumable');
        if (editBtn) {
            editBtn.addEventListener('click', () => openAdminConsumableModal(item));
        }

        const deleteBtn = tr.querySelector('.delete-consumable');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteConsumableItem(item.id, item.name));
        }

        tableBody.appendChild(tr);
    });
}

function renderConsumablesCards(items) {
    if (!DOM.consumablesGrid) return;
    DOM.consumablesGrid.innerHTML = '';

    if (items.length === 0) {
        DOM.consumablesGrid.innerHTML = '<div class="loading-spinner"><p>Tidak ada data barang habis pakai ditemukan.</p></div>';
        return;
    }

    items.forEach(item => {
        const isLow = Number(item.stock) <= Number(item.minStock);
        const card = document.createElement('div');
        card.className = 'event-card glass';
        card.style.position = 'relative';

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <div>
                    <span style="font-size: 0.75rem; background: rgba(37,99,235,0.1); color: var(--color-primary); padding: 2px 8px; border-radius: 10px; font-weight: 600;">${item.category || 'Umum'}</span>
                    <h3 style="margin: 0.4rem 0 0.2rem 0; font-size: 1.1rem; color: var(--color-text);">${item.name}</h3>
                </div>
                <span class="stock-badge ${isLow ? 'low' : 'safe'}">
                    ${isLow ? '<i class="fas fa-exclamation-circle"></i> Stok Kritis' : '<i class="fas fa-check-circle"></i> Stok Aman'}
                </span>
            </div>
            
            <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 0.8rem;">
                <span style="font-size: 1.6rem; font-weight: 700; color: ${isLow ? '#e11d48' : 'var(--color-primary)'};">${item.stock}</span>
                <span style="font-size: 0.9rem; color: #64748b; font-weight: 500;">${item.unit || 'Unit'}</span>
                <span style="font-size: 0.75rem; color: #94a3b8; margin-left: auto;">(Min: ${item.minStock})</span>
            </div>

            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 1rem;">
                <i class="fas fa-map-marker-alt" style="color: var(--color-primary);"></i> ${item.location || 'Gudang Sarpras'}
            </div>

            <div style="display: flex; gap: 6px; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 0.8rem;">
                <button class="btn btn-primary btn-sm btn-take-consumable" data-id="${item.id}" style="padding: 5px 10px; font-size: 0.8rem;">
                    <i class="fas fa-hand-holding"></i> Ambil Barang
                </button>
                <div class="admin-only ${isAdmin ? '' : 'hidden'}" style="display: flex; gap: 4px;">
                    <button class="action-icon edit-consumable btn-sm" data-id="${item.id}" title="Edit Barang"><i class="fas fa-edit"></i></button>
                    <button class="action-icon delete delete-consumable btn-sm" data-id="${item.id}" title="Hapus Barang"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;

        card.querySelector('.btn-take-consumable').addEventListener('click', () => {
            openPublicMultiOutModal(item.id);
        });

        const editBtn = card.querySelector('.edit-consumable');
        if (editBtn) {
            editBtn.addEventListener('click', () => openAdminConsumableModal(item));
        }

        const deleteBtn = card.querySelector('.delete-consumable');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteConsumableItem(item.id, item.name));
        }

        DOM.consumablesGrid.appendChild(card);
    });
}

function renderConsumableHistory() {
    if (!DOM.consumableHistoryTableBody) return;
    DOM.consumableHistoryTableBody.innerHTML = '';

    if (consumableLogs.length === 0) {
        DOM.consumableHistoryTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 1.5rem; color: #64748b;">Belum ada riwayat mutasi barang.</td></tr>`;
        return;
    }

    consumableLogs.forEach(log => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--glass-border)';
        const isIN = log.type === 'IN';

        tr.innerHTML = `
            <td style="padding: 8px 12px; white-space: nowrap;">${log.date || ''}</td>
            <td style="padding: 8px 12px;">
                <span style="font-size: 0.75rem; font-weight: 700; padding: 2px 6px; border-radius: 6px; background: ${isIN ? 'rgba(16,185,129,0.15)' : 'rgba(225,29,72,0.15)'}; color: ${isIN ? '#059669' : '#e11d48'};">
                    ${isIN ? '📥 MASUK' : '📤 KELUAR'}
                </span>
            </td>
            <td style="padding: 8px 12px; font-weight: 600;">${log.itemName || '-'}</td>
            <td style="padding: 8px 12px; font-weight: 700; color: ${isIN ? '#059669' : '#e11d48'};">${isIN ? '+' : '-'}${log.quantity}</td>
            <td style="padding: 8px 12px;">${log.actor || '-'}</td>
            <td style="padding: 8px 12px; color: #64748b;">${log.notes || '-'}</td>
        `;
        DOM.consumableHistoryTableBody.appendChild(tr);
    });
}

function addConsumableItemRow(selectedItemId = "", selectedQty = 1) {
    if (!DOM.consumableItemRowsContainer) return;

    const row = document.createElement('div');
    row.className = 'consumable-row-item';
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';

    let optionsHtml = '<option value="">-- Pilih Barang --</option>';
    consumables.forEach(c => {
        const selected = c.id === selectedItemId ? 'selected' : '';
        optionsHtml += `<option value="${c.id}" ${selected}>${c.name} (Stok: ${c.stock} ${c.unit})</option>`;
    });

    row.innerHTML = `
        <select class="form-control item-select" required style="flex: 2;">
            ${optionsHtml}
        </select>
        <input type="number" class="form-control item-qty" min="1" value="${selectedQty}" required placeholder="Qty" style="width: 90px;">
        <button type="button" class="btn btn-secondary btn-sm remove-row-btn" style="padding: 6px 10px; color: #e11d48;">
            <i class="fas fa-trash"></i>
        </button>
    `;

    row.querySelector('.remove-row-btn').addEventListener('click', () => {
        if (DOM.consumableItemRowsContainer.children.length > 1) {
            row.remove();
        } else {
            alert('Minimal 1 barang harus dipilih.');
        }
    });

    DOM.consumableItemRowsContainer.appendChild(row);
}

function openPublicMultiOutModal(initialItemId = null) {
    if (DOM.publicMultiOutForm) DOM.publicMultiOutForm.reset();
    if (DOM.consumableItemRowsContainer) DOM.consumableItemRowsContainer.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('multiOutDate');
    if (dateInput) dateInput.value = today;

    addConsumableItemRow(initialItemId || (consumables[0] ? consumables[0].id : ''), 1);
    if (DOM.publicMultiOutModal) DOM.publicMultiOutModal.classList.remove('hidden');
}

async function handlePublicMultiOutSubmit(e) {
    e.preventDefault();
    const pwdInput = document.getElementById('multiOutPassword');
    const pwd = pwdInput ? pwdInput.value.trim() : '';

    if (pwd !== 'sarpras_dua' && pwd !== 'Andalusia_2') {
        alert('Password verifikasi salah! Silakan periksa kembali password yang Anda masukkan.');
        return;
    }

    const rows = DOM.consumableItemRowsContainer ? DOM.consumableItemRowsContainer.querySelectorAll('.consumable-row-item') : [];
    if (rows.length === 0) {
        alert('Silakan pilih minimal 1 barang.');
        return;
    }

    const date = document.getElementById('multiOutDate').value;
    const actor = document.getElementById('multiOutActor').value.trim();
    const notes = document.getElementById('multiOutNotes').value.trim();

    // 1. Validasi Stok Seluruh Barang yang Dipilih
    const pendingTransactions = [];
    for (let r of rows) {
        const itemId = r.querySelector('.item-select').value;
        const qty = parseInt(r.querySelector('.item-qty').value);

        if (!itemId) {
            alert('Silakan pilih barang pada setiap baris.');
            return;
        }
        if (isNaN(qty) || qty <= 0) {
            alert('Jumlah pengambilan barang harus lebih dari 0.');
            return;
        }

        const item = consumables.find(c => c.id === itemId);
        if (!item) {
            alert('Barang tidak ditemukan.');
            return;
        }

        if (Number(item.stock) < qty) {
            alert(`Stok barang "${item.name}" tidak mencukupi! Sisa stok saat ini: ${item.stock} ${item.unit}.`);
            return;
        }

        pendingTransactions.push({ item, qty });
    }

    // 2. Potong Stok & Buat Log Mutasi
    for (let tx of pendingTransactions) {
        const { item, qty } = tx;
        item.stock = Number(item.stock) - qty;

        const log = {
            id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            itemId: item.id,
            itemName: item.name,
            type: 'OUT',
            quantity: qty,
            date: date,
            actor: actor,
            notes: notes,
            createdAt: new Date().toISOString()
        };

        await saveToDatabase('consumables', item.id, item, true);
        await saveToDatabase('consumable_logs', log.id, log, false);
    }

    renderConsumables();
    if (DOM.publicMultiOutModal) DOM.publicMultiOutModal.classList.add('hidden');
    alert(`Berhasil mencatat pengambilan ${pendingTransactions.length} jenis barang!`);
}

function openAdminConsumableModal(item = null) {
    if (DOM.adminConsumableForm) DOM.adminConsumableForm.reset();
    if (item) {
        document.getElementById('adminConsumableModalTitle').textContent = 'Edit Barang Habis Pakai';
        document.getElementById('adminConsumableId').value = item.id;
        document.getElementById('adminConsumableName').value = item.name;
        document.getElementById('adminConsumableCategory').value = item.category || 'ATK';
        document.getElementById('adminConsumableUnit').value = item.unit || 'Pcs';
        document.getElementById('adminConsumableStock').value = item.stock || 0;
        document.getElementById('adminConsumableMinStock').value = item.minStock || 5;
        document.getElementById('adminConsumableLocation').value = item.location || '';
    } else {
        document.getElementById('adminConsumableModalTitle').textContent = 'Tambah Barang Habis Pakai';
        document.getElementById('adminConsumableId').value = '';
    }
    if (DOM.adminConsumableModal) DOM.adminConsumableModal.classList.remove('hidden');
}

async function handleAdminSaveConsumable(e) {
    e.preventDefault();
    const id = document.getElementById('adminConsumableId').value;
    const name = document.getElementById('adminConsumableName').value.trim();
    const category = document.getElementById('adminConsumableCategory').value;
    const unit = document.getElementById('adminConsumableUnit').value.trim();
    const stock = parseInt(document.getElementById('adminConsumableStock').value) || 0;
    const minStock = parseInt(document.getElementById('adminConsumableMinStock').value) || 0;
    const location = document.getElementById('adminConsumableLocation').value.trim();

    const itemData = {
        id: id || ('c_' + Date.now()),
        name, category, unit, stock, minStock, location,
        updatedAt: new Date().toISOString()
    };

    await saveToDatabase('consumables', itemData.id, itemData, Boolean(id));
    if (DOM.adminConsumableModal) DOM.adminConsumableModal.classList.add('hidden');
    renderConsumables();
    alert(`Barang "${name}" berhasil disimpan.`);
}

async function deleteConsumableItem(id, name) {
    if (confirm(`Apakah Anda yakin ingin menghapus barang "${name}"?`)) {
        await deleteFromDatabase('consumables', id);
        renderConsumables();
        alert(`Barang "${name}" berhasil dihapus.`);
    }
}

function openAdminRestockModal() {
    if (DOM.adminRestockForm) DOM.adminRestockForm.reset();
    const select = document.getElementById('restockItemId');
    if (!select) return;
    select.innerHTML = '';

    if (consumables.length === 0) {
        alert('Belum ada data barang. Silakan tambah barang baru terlebih dahulu.');
        return;
    }

    consumables.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (Stok Saat Ini: ${c.stock} ${c.unit})`;
        select.appendChild(opt);
    });

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('restockDate').value = today;
    if (DOM.adminRestockModal) DOM.adminRestockModal.classList.remove('hidden');
}

async function handleAdminRestockSubmit(e) {
    e.preventDefault();
    const itemId = document.getElementById('restockItemId').value;
    const qty = parseInt(document.getElementById('restockQuantity').value);
    const date = document.getElementById('restockDate').value;
    const supplier = document.getElementById('restockSupplier').value.trim();
    const notes = document.getElementById('restockNotes').value.trim();

    const item = consumables.find(c => c.id === itemId);
    if (!item) return;

    item.stock = Number(item.stock) + qty;

    const log = {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        itemId: item.id,
        itemName: item.name,
        type: 'IN',
        quantity: qty,
        date: date,
        actor: supplier || 'Admin Sarpras',
        notes: notes || 'Restock barang masuk',
        createdAt: new Date().toISOString()
    };

    await saveToDatabase('consumables', item.id, item, true);
    await saveToDatabase('consumable_logs', log.id, log, false);

    if (DOM.adminRestockModal) DOM.adminRestockModal.classList.add('hidden');
    renderConsumables();
    alert(`Berhasil melakukan restock ${qty} ${item.unit} untuk "${item.name}"!`);
}

function applyCmsContent() {
    DOM.cmsEditables.forEach(el => {
        const key = el.getAttribute('data-cms-key');
        if (cmsContent[key]) {
            el.textContent = cmsContent[key];
        }
    });
}

function normalizeFacilityName(name) {
    return (name || '').toLowerCase().replace(/[\s-]/g, '');
}

function renderFacilities() {
    if (facilityChoices) {
        try {
            facilityChoices.destroy();
        } catch (e) {
            console.warn("Catatan destroy Choices:", e);
        }
        facilityChoices = null;
    }
    DOM.eventFacility.innerHTML = '';

    if (facilities.length === 0) {
        facilities = [...DEFAULT_FACILITIES];
    }
    const sortedFacilities = [...facilities].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));

    sortedFacilities.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f;
        opt.textContent = f;
        DOM.eventFacility.appendChild(opt);
    });

    if (typeof Choices !== 'undefined') {
        facilityChoices = new Choices(DOM.eventFacility, {
            removeItemButton: true,
            placeholderValue: 'Cari & pilih fasilitas...',
            searchPlaceholderValue: 'Ketik nama fasilitas (contoh: X E 1)...',
            itemSelectText: 'Pilih',
            noResultsText: 'Tidak ditemukan',
            noChoicesText: 'Semua fasilitas sudah dipilih',
            shouldSort: false,
            searchResultLimit: 500,
            renderChoiceLimit: -1,
            fuseOptions: {
                threshold: 0.3
            }
        });
    }

    const complaintLocationSelect = document.getElementById('complaintLocation');
    if (complaintLocationSelect) {
        const currentVal = complaintLocationSelect.value;
        complaintLocationSelect.innerHTML = '<option value="">-- Pilih Lokasi Fasilitas / Ruangan --</option>';
        sortedFacilities.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f;
            opt.textContent = f;
            complaintLocationSelect.appendChild(opt);
        });
        if (currentVal) complaintLocationSelect.value = currentVal;
    }

    const quickReportSearchInput = document.getElementById('quickReportSearchInput');
    if (quickReportSearchInput) {
        const currentVal = quickReportSearchInput.value;
        quickReportSearchInput.innerHTML = '<option value="">-- Semua Fasilitas / Ruangan --</option>';
        sortedFacilities.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f;
            opt.textContent = f;
            quickReportSearchInput.appendChild(opt);
        });
        if (currentVal) quickReportSearchInput.value = currentVal;
    }

    renderFacilityAdminList();
}

function renderFacilityAdminList(filterText = "") {
    DOM.facilitiesList.innerHTML = '';
    const lowerFilter = filterText.toLowerCase();
    const normalizedFilter = normalizeFacilityName(filterText);

    let hasExactMatch = false;

    const facilityObjects = facilities.map((f, idx) => ({ f, idx }));
    facilityObjects.sort((a, b) => a.f.localeCompare(b.f, 'id', { numeric: true, sensitivity: 'base' }));

    facilityObjects.forEach(({ f, idx }) => {
        const normalizedF = normalizeFacilityName(f);
        if (f.toLowerCase().includes(lowerFilter) || normalizedF.includes(normalizedFilter)) {
            if (normalizedF === normalizedFilter) hasExactMatch = true;

            const isMapped = !!mapCoordinates[normalizedF];

            const li = document.createElement('li');
            li.innerHTML = `
                <div class="fac-info">
                    <span class="fac-name">${f}</span>
                    <span class="fac-badge ${isMapped ? 'mapped' : 'unmapped'}" style="cursor: pointer;" title="${isMapped ? 'Sudah memiliki koordinat denah (Klik untuk buka editor)' : 'Belum memiliki koordinat denah (Klik untuk petakan)'}">
                        <i class="${isMapped ? 'fas fa-map-marker-alt' : 'far fa-map'}"></i> ${isMapped ? 'Dipetakan' : 'Belum ada denah'}
                    </span>
                </div>
                <div class="fac-actions">
                    <button class="action-icon edit edit-fac btn-sm" data-idx="${idx}" title="Edit Nama Fasilitas"><i class="fas fa-edit"></i></button>
                    <button class="action-icon delete delete-fac btn-sm" data-idx="${idx}" title="Hapus Fasilitas"><i class="fas fa-trash"></i></button>
                </div>
            `;

            li.querySelector('.fac-badge').addEventListener('click', () => {
                DOM.facilitiesModal.classList.add('hidden');
                openMapEditorForFacility(f);
            });

            DOM.facilitiesList.appendChild(li);
        }
    });

    DOM.facilitiesList.querySelectorAll('.edit-fac').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            const oldName = facilities[idx];
            const newName = prompt(`Edit nama fasilitas "${oldName}":`, oldName);

            if (newName && newName.trim() !== '' && newName.trim() !== oldName) {
                const trimmed = newName.trim();
                const oldKey = normalizeFacilityName(oldName);
                const newKey = normalizeFacilityName(trimmed);

                const exists = facilities.some((fac, i) => i !== idx && normalizeFacilityName(fac) === newKey);
                if (exists) {
                    alert(`Fasilitas "${trimmed}" sudah ada di daftar!`);
                    return;
                }

                facilities[idx] = trimmed;

                if (mapCoordinates[oldKey]) {
                    mapCoordinates[newKey] = mapCoordinates[oldKey];
                    delete mapCoordinates[oldKey];
                    await saveToDatabase('settings', 'mapCoordinates', { coords: mapCoordinates });
                }

                await saveToDatabase('settings', 'facilities', { list: facilities });
                renderFacilities();
            }
        });
    });

    DOM.facilitiesList.querySelectorAll('.delete-fac').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            const facName = facilities[idx];

            if (confirm(`Apakah Anda yakin ingin menghapus fasilitas "${facName}"?\n(Titik koordinat denah fasilitas ini juga akan dihapus)`)) {
                facilities.splice(idx, 1);

                const key = normalizeFacilityName(facName);
                if (mapCoordinates[key]) {
                    delete mapCoordinates[key];
                    await saveToDatabase('settings', 'mapCoordinates', { coords: mapCoordinates });
                }

                await saveToDatabase('settings', 'facilities', { list: facilities });
                renderFacilities();
            }
        });
    });

    if (hasExactMatch && filterText.trim() !== '') {
        DOM.addFacilityBtn.disabled = true;
        DOM.addFacilityBtn.textContent = 'Sudah Ada';
        DOM.addFacilityBtn.style.opacity = '0.6';
    } else {
        DOM.addFacilityBtn.disabled = false;
        DOM.addFacilityBtn.textContent = 'Tambah';
        DOM.addFacilityBtn.style.opacity = '1';
    }
}

function renderEvents(filterText = "") {
    DOM.eventsGrid.innerHTML = '';

    let filteredEvents = [...events];
    filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filterText) {
        const lowerFilter = filterText.toLowerCase();
        filteredEvents = filteredEvents.filter(e => {
            const facText = Array.isArray(e.facility) ? e.facility.join(' ') : (e.facility || '');
            return (e.title || '').toLowerCase().includes(lowerFilter) ||
                facText.toLowerCase().includes(lowerFilter) ||
                (e.organizer || '').toLowerCase().includes(lowerFilter) ||
                (e.nomorSurat || '').toLowerCase().includes(lowerFilter) ||
                (e.cp || '').toLowerCase().includes(lowerFilter) ||
                (e.technical || '').toLowerCase().includes(lowerFilter);
        });
    }

    if (filteredEvents.length === 0) {
        DOM.eventsGrid.innerHTML = '<div class="loading-spinner"><p>Tidak ada jadwal ditemukan.</p></div>';
        return;
    }

    filteredEvents.forEach(event => {
        const dateObj = new Date(event.date);
        let dateStr = dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        if (event.endDate) {
            const endObj = new Date(event.endDate);
            const endStr = endObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            dateStr = `${dateStr} s.d. ${endStr}`;
        }

        if (event.time) {
            dateStr += ` • 🕒 ${event.time}`;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.date);
        const isPast = eventEnd < today;

        const facDisplay = Array.isArray(event.facility) ? event.facility.join(', ') : event.facility;

        const card = document.createElement('div');
        card.className = `event-card glass ${isPast ? 'past-event' : ''}`;
        card.innerHTML = `
            <div class="event-date">${dateStr} ${isPast ? '<span class="badge" style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 5px;">Selesai</span>' : ''}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-facility">${facDisplay || '-'}</div>
            <div class="event-footer">
                <span><i class="fas fa-user"></i> ${event.organizer}</span>
            </div>
            <div class="card-actions">
                <button class="action-icon edit edit-event-btn" data-id="${event.id}" title="Edit Acara"><i class="fas fa-edit"></i></button>
                <button class="action-icon delete delete-event-btn" data-id="${event.id}" title="Hapus Acara"><i class="fas fa-trash"></i></button>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.card-actions')) return;
            showEventDetail(event, dateStr);
        });

        DOM.eventsGrid.appendChild(card);
    });

    document.querySelectorAll('.edit-event-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const event = events.find(ev => ev.id === id);
            openEventModal(event);
        });
    });

    document.querySelectorAll('.delete-event-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
                const id = e.currentTarget.getAttribute('data-id');
                await deleteFromDatabase('events', id);
            }
        });
    });
}

// --- Modul Kendaraan Operasional Rendering ---
function getDaysDifference(targetDateStr) {
    if (!targetDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function renderVehicles(filterText = "") {
    if (!DOM.vehiclesGrid) return;
    DOM.vehiclesGrid.innerHTML = '';
    DOM.vehicleAlertBanner.innerHTML = '';

    let filteredVehicles = [...vehicles];

    if (filterText) {
        const lower = filterText.toLowerCase();
        filteredVehicles = filteredVehicles.filter(v =>
            (v.name || '').toLowerCase().includes(lower) ||
            (v.plate || '').toLowerCase().includes(lower) ||
            (v.type || '').toLowerCase().includes(lower)
        );
    }

    let alertsHTML = '';
    vehicles.forEach(v => {
        const taxDiff = getDaysDifference(v.taxDate);
        const oilDiff = getDaysDifference(v.nextOilDate);
        const plateDiff = getDaysDifference(v.plateDate);

        if (taxDiff !== null) {
            if (taxDiff < 0) {
                alertsHTML += `<div class="alert-banner-item alert-banner-danger"><i class="fas fa-exclamation-triangle"></i> <strong>PAJAK JATUH TEMPO LEWAT:</strong> Pajak STNK ${v.name} (${v.plate}) telah lewat ${Math.abs(taxDiff)} hari!</div>`;
            } else if (taxDiff <= 14) {
                alertsHTML += `<div class="alert-banner-item alert-banner-warning"><i class="fas fa-exclamation-circle"></i> <strong>PERINGATAN PAJAK:</strong> Pajak STNK ${v.name} (${v.plate}) jatuh tempo dalam ${taxDiff} hari (${v.taxDate}).</div>`;
            }
        }

        if (oilDiff !== null) {
            if (oilDiff < 0) {
                alertsHTML += `<div class="alert-banner-item alert-banner-danger"><i class="fas fa-oil-can"></i> <strong>GANTI OLI LEWAT TARGET:</strong> ${v.name} (${v.plate}) telah lewat target ganti oli ${Math.abs(oilDiff)} hari!</div>`;
            } else if (oilDiff <= 14) {
                alertsHTML += `<div class="alert-banner-item alert-banner-warning"><i class="fas fa-oil-can"></i> <strong>JADWAL GANTI OLI:</strong> ${v.name} (${v.plate}) perlu ganti oli dalam ${oilDiff} hari (${v.nextOilDate}).</div>`;
            }
        }

        if (plateDiff !== null && plateDiff <= 30) {
            if (plateDiff < 0) {
                alertsHTML += `<div class="alert-banner-item alert-banner-danger"><i class="fas fa-id-card"></i> <strong>GANTI PLAT 5 TAHUNAN LEWAT:</strong> Plat nomor ${v.name} (${v.plate}) lewat ${Math.abs(plateDiff)} hari!</div>`;
            } else {
                alertsHTML += `<div class="alert-banner-item alert-banner-warning"><i class="fas fa-id-card"></i> <strong>GANTI PLAT 5 TAHUNAN:</strong> Plat nomor ${v.name} (${v.plate}) jatuh tempo dalam ${plateDiff} hari.</div>`;
            }
        }
    });

    DOM.vehicleAlertBanner.innerHTML = alertsHTML;

    if (filteredVehicles.length === 0) {
        DOM.vehiclesGrid.innerHTML = '<div class="loading-spinner" style="grid-column: 1/-1;"><p>Belum ada data kendaraan operasional.</p></div>';
        return;
    }

    filteredVehicles.forEach(v => {
        let iconClass = 'fa-car';
        if (v.type === 'Motor') iconClass = 'fa-motorcycle';
        if (v.type === 'Bus') iconClass = 'fa-bus';

        let statusBadgeClass = 'vehicle-status-ready';
        if (v.status === 'Perlu Perbaikan') statusBadgeClass = 'vehicle-status-warning';
        if (v.status === 'Dalam Servis') statusBadgeClass = 'vehicle-status-danger';

        const taxDiff = getDaysDifference(v.taxDate);
        let taxDisplay = v.taxDate || '-';
        if (taxDiff !== null) {
            if (taxDiff < 0) taxDisplay += ` <span style="color:#b91c1c; font-weight:700;">(Lewat ${Math.abs(taxDiff)} hr)</span>`;
            else if (taxDiff <= 14) taxDisplay += ` <span style="color:#a16207; font-weight:700;">(${taxDiff} hr lagi)</span>`;
        }

        const nextOilDisplay = v.nextOilDate || '-';

        const card = document.createElement('div');
        card.className = 'vehicle-card glass';
        card.innerHTML = `
            <div class="vehicle-header">
                <div class="vehicle-icon"><i class="fas ${iconClass}"></i></div>
                <div class="vehicle-title-box">
                    <div class="vehicle-name">${v.name}</div>
                    <span class="vehicle-plate">${v.plate || '-'}</span>
                </div>
                <span class="vehicle-status-badge ${statusBadgeClass}">${v.status || 'Siap Operasional'}</span>
            </div>

            <div class="vehicle-meta-grid">
                <div class="vehicle-meta-item">
                    <div class="vehicle-meta-label">📅 Pajak STNK Tahunan</div>
                    <div class="vehicle-meta-value">${taxDisplay}</div>
                </div>
                <div class="vehicle-meta-item">
                    <div class="vehicle-meta-label">🛢️ Target Ganti Oli</div>
                    <div class="vehicle-meta-value">${nextOilDisplay} ${v.kmNextOil ? `(${v.kmNextOil} KM)` : ''}</div>
                </div>
                <div class="vehicle-meta-item">
                    <div class="vehicle-meta-label">💳 Pajak Plat 5 Thn</div>
                    <div class="vehicle-meta-value">${v.plateDate || '-'}</div>
                </div>
                <div class="vehicle-meta-item">
                    <div class="vehicle-meta-label">🛣️ KM Saat Ini</div>
                    <div class="vehicle-meta-value">${v.km ? `${v.km} KM` : '-'}</div>
                </div>
            </div>

            ${v.notes ? `<div style="font-size: 0.85rem; color: var(--color-text-muted); background: rgba(0,0,0,0.03); padding: 8px 12px; border-radius: 8px;"><strong>Catatan:</strong> ${v.notes}</div>` : ''}

            <div class="card-actions">
                <button class="action-icon edit edit-veh-btn" data-id="${v.id}" title="Edit Kendaraan"><i class="fas fa-edit"></i></button>
                <button class="action-icon delete delete-veh-btn" data-id="${v.id}" title="Hapus Kendaraan"><i class="fas fa-trash"></i></button>
            </div>
        `;

        DOM.vehiclesGrid.appendChild(card);
    });

    DOM.vehiclesGrid.querySelectorAll('.edit-veh-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const veh = vehicles.find(v => v.id === id);
            openVehicleModal(veh);
        });
    });

    DOM.vehiclesGrid.querySelectorAll('.delete-veh-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm("Apakah Anda yakin ingin menghapus data kendaraan ini?")) {
                const id = e.currentTarget.getAttribute('data-id');
                await deleteFromDatabase('vehicles', id);
            }
        });
    });
}

function openVehicleModal(veh = null) {
    DOM.vehicleForm.reset();
    document.getElementById('vehicleId').value = '';
    document.getElementById('vehicleModalTitle').textContent = 'Tambah Kendaraan Operasional';

    if (veh) {
        document.getElementById('vehicleModalTitle').textContent = 'Edit Kendaraan Operasional';
        document.getElementById('vehicleId').value = veh.id;
        document.getElementById('vehicleName').value = veh.name || '';
        document.getElementById('vehiclePlate').value = veh.plate || '';
        document.getElementById('vehicleType').value = veh.type || 'Mobil';
        document.getElementById('vehicleStatus').value = veh.status || 'Siap Operasional';
        document.getElementById('vehicleKm').value = veh.km || '';
        document.getElementById('vehicleKmNextOil').value = veh.kmNextOil || '';
        document.getElementById('vehicleLastOilDate').value = veh.lastOilDate || '';
        document.getElementById('vehicleNextOilDate').value = veh.nextOilDate || '';
        document.getElementById('vehicleTaxDate').value = veh.taxDate || '';
        document.getElementById('vehiclePlateDate').value = veh.plateDate || '';
        document.getElementById('vehicleNotes').value = veh.notes || '';
    }

    DOM.vehicleModal.classList.remove('hidden');
}

// --- Modul Pengaduan & Aspirasi Warga Sekolah Rendering ---
function renderComplaints(filterText = "", statusFilter = currentComplaintStatusFilter) {
    // Render visualisasi map denah sekolah
    renderComplaintsMap();
    
    // Render Lapor Cepat (Quick Report Table)
    if (typeof renderQuickReportList === 'function') {
        renderQuickReportList(filterText, statusFilter);
    }
}

function renderComplaintsMap() {
    const wrapper = document.getElementById('complaintsMapWrapper');
    if (!wrapper) return;

    // Hapus overlay lama
    wrapper.querySelectorAll('.complaint-map-box').forEach(box => box.remove());

    // Grouping status laporan berdasarkan lokasi & kategori organik/anorganik
    const statusByLocation = {};
    complaints.forEach(c => {
        if (!c.location) return;
        const normLoc = normalizeFacilityName(c.location);
        if (!statusByLocation[normLoc]) {
            statusByLocation[normLoc] = { orgState: 'neutral', inorgState: 'neutral', pendingOrg: 0, pendingInorg: 0 };
        }
        
        const isPending = (c.status || 'Pending') === 'Pending';
        const cat = (c.category || '').toLowerCase();
        
        let affectsOrg = cat.includes('organik') && !cat.includes('anorganik');
        let affectsInorg = cat.includes('anorganik') && !cat.includes('campur') && !cat.includes('organik & anorganik');
        
        if (cat.includes('campur') || cat.includes('organik & anorganik') || cat.includes('penuh') || cat === 'pemilahan sampah' || cat.includes('lainnya')) {
            affectsOrg = true;
            affectsInorg = true;
        } else if (!affectsOrg && !affectsInorg) {
            affectsOrg = true;
        }

        if (affectsOrg) {
            if (isPending) {
                statusByLocation[normLoc].orgState = 'unsorted';
                statusByLocation[normLoc].pendingOrg++;
            } else if (statusByLocation[normLoc].orgState === 'neutral') {
                statusByLocation[normLoc].orgState = 'sorted';
            }
        }
        
        if (affectsInorg) {
            if (isPending) {
                statusByLocation[normLoc].inorgState = 'unsorted';
                statusByLocation[normLoc].pendingInorg++;
            } else if (statusByLocation[normLoc].inorgState === 'neutral') {
                statusByLocation[normLoc].inorgState = 'sorted';
            }
        }
    });

    const keys = Object.keys(mapCoordinates);

    // Iterasi semua fasilitas terpetakan pada denah
    keys.forEach(normKey => {
        const coords = mapCoordinates[normKey];
        if (!coords || !coords.top || !coords.left) return;

        const originalFacilityName = facilities.find(f => normalizeFacilityName(f) === normKey) || normKey;
        const locData = statusByLocation[normKey] || { pendingOrganic: 0, pendingInorganic: 0 };
        
        let orgState = locData.orgState || 'neutral';
        let inorgState = locData.inorgState || 'neutral';
        
        let isUnsorted = (orgState === 'unsorted' || inorgState === 'unsorted');
        let isNeutral = (orgState === 'neutral' && inorgState === 'neutral');

        let pendingOrg = locData.pendingOrg || 0;
        let pendingInorg = locData.pendingInorg || 0;

        let statusClass = isUnsorted ? 'status-red' : (isNeutral ? 'status-neutral' : 'status-green');
        let tooltipText = isUnsorted 
            ? `📍 ${originalFacilityName}\n🔴 Belum Dipilah (Organik: ${pendingOrg}, Anorganik: ${pendingInorg})\nKlik untuk melihat di daftar lapor cepat` 
            : (isNeutral ? `📍 ${originalFacilityName}\n⚪ Belum Dicek / Dimonitor` : `📍 ${originalFacilityName}\n🟢 Sudah Terpilah Rapi`);

        const box = document.createElement('div');
        box.className = `complaint-map-box ${statusClass}`;
        box.style.top = coords.top;
        box.style.left = coords.left;
        box.style.width = coords.width;
        box.style.height = coords.height;
        box.title = tooltipText;
        box.innerHTML = '';

        // Saat diklik, tampilkan popup modal untuk aksi cepat pada fasilitas ini
        box.addEventListener('click', () => {
            if (typeof window.openMapActionModal === 'function') {
                window.openMapActionModal(originalFacilityName);
            }
        });

        wrapper.appendChild(box);
    });
}

function renderQuickReportList(filterText = "", statusFilter = "all") {
    const tbody = document.getElementById('quickReportTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    let totalRooms = facilities.length;
    let cleanRooms = 0;
    let pendingOrganicCount = 0;
    let pendingInorganicCount = 0;

    const allFacs = [...facilities].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));

    allFacs.forEach(fac => {
        let orgState = 'neutral';
        let inorgState = 'neutral';

        complaints.forEach(c => {
            if (c.location === fac) {
                const isPending = (c.status || 'Pending') === 'Pending';
                const cat = (c.category || '').toLowerCase();
                
                let affectsOrg = cat.includes('organik') && !cat.includes('anorganik');
                let affectsInorg = cat.includes('anorganik') && !cat.includes('campur') && !cat.includes('organik & anorganik');
                
                if (cat.includes('campur') || cat.includes('organik & anorganik') || cat.includes('penuh') || cat === 'pemilahan sampah' || cat.includes('lainnya')) {
                    affectsOrg = true;
                    affectsInorg = true;
                } else if (!affectsOrg && !affectsInorg) {
                    affectsOrg = true;
                }

                if (affectsOrg) {
                    if (isPending) orgState = 'unsorted';
                    else if (orgState === 'neutral') orgState = 'sorted';
                }
                if (affectsInorg) {
                    if (isPending) inorgState = 'unsorted';
                    else if (inorgState === 'neutral') inorgState = 'sorted';
                }
            }
        });

        if (orgState === 'unsorted') pendingOrganicCount++;
        if (inorgState === 'unsorted') pendingInorganicCount++;
        if (orgState !== 'unsorted' && inorgState !== 'unsorted') cleanRooms++;

        // Filtering
        if (filterText && !fac.toLowerCase().includes(filterText.toLowerCase())) return;
        
        let isUnsortedAny = (orgState === 'unsorted' || inorgState === 'unsorted');
        if (statusFilter === 'unsorted' && !isUnsortedAny) return;
        if (statusFilter === 'sorted' && isUnsortedAny) return;

        const tr = document.createElement('tr');
        
        const tdName = document.createElement('td');
        tdName.setAttribute('data-label', 'Fasilitas');
        tdName.innerHTML = `<i class="fas fa-map-marker-alt" style="color: var(--color-primary-light); margin-right: 6px;"></i> <strong>${fac}</strong>`;
        
        const tdOrg = document.createElement('td');
        tdOrg.setAttribute('data-label', 'Organik');
        tdOrg.innerHTML = `
            <div class="waste-toggle-group">
                <button type="button" class="waste-toggle-btn btn-sorted ${orgState === 'sorted' ? 'active' : ''}" onclick="handleQuickToggleWaste('${fac}', 'organik', 'sorted')"><i class="fas fa-check"></i> Sudah</button>
                <button type="button" class="waste-toggle-btn btn-unsorted ${orgState === 'unsorted' ? 'active' : ''}" onclick="handleQuickToggleWaste('${fac}', 'organik', 'unsorted')"><span class="dot"></span> Belum</button>
            </div>
        `;
        
        const tdInorg = document.createElement('td');
        tdInorg.setAttribute('data-label', 'Anorganik');
        tdInorg.innerHTML = `
            <div class="waste-toggle-group">
                <button type="button" class="waste-toggle-btn btn-sorted ${inorgState === 'sorted' ? 'active' : ''}" onclick="handleQuickToggleWaste('${fac}', 'anorganik', 'sorted')"><i class="fas fa-check"></i> Sudah</button>
                <button type="button" class="waste-toggle-btn btn-unsorted ${inorgState === 'unsorted' ? 'active' : ''}" onclick="handleQuickToggleWaste('${fac}', 'anorganik', 'unsorted')"><span class="dot"></span> Belum</button>
            </div>
        `;
        
        const tdAction = document.createElement('td');
        tdAction.setAttribute('data-label', 'Lapor Detail');
        tdAction.innerHTML = `
            <button type="button" class="btn-detail-quick" onclick="openDetailComplaintForFacility('${fac}')">
                <i class="fas fa-edit"></i> Detail
            </button>
        `;

        tr.appendChild(tdName);
        tr.appendChild(tdOrg);
        tr.appendChild(tdInorg);
        tr.appendChild(tdAction);
        
        tbody.appendChild(tr);
    });

    if (tbody.children.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: var(--color-text-muted);">Tidak ada fasilitas yang cocok dengan filter / pencarian.</td></tr>`;
    }

    // Update ringkasan indikator
    if (document.getElementById('statTotalRooms')) document.getElementById('statTotalRooms').textContent = totalRooms;
    if (document.getElementById('statCleanRooms')) document.getElementById('statCleanRooms').textContent = cleanRooms;
    if (document.getElementById('statPendingOrganic')) document.getElementById('statPendingOrganic').textContent = pendingOrganicCount;
    if (document.getElementById('statPendingInorganic')) document.getElementById('statPendingInorganic').textContent = pendingInorganicCount;
}

window.getQuickReportDate = function() {
    const dp = document.getElementById('quickReportDate');
    if (dp && dp.value) {
        const d = new Date(dp.value);
        d.setHours(new Date().getHours(), new Date().getMinutes());
        return d.toISOString();
    }
    return new Date().toISOString();
};

window.handleQuickToggleWaste = async function(facilityName, wasteType, targetStatus) {
    if (!isAdmin && !isOperator) {
        alert('Silakan login terlebih dahulu untuk memperbarui status pemilahan sampah.');
        return;
    }

    let currentState = 'neutral';
    let pendingComplaint = null;
    let sortedComplaint = null;
    let isMixedPending = false;
    let isMixedSorted = false;

    // 1. Tentukan status fasilitas & tipe sampah saat ini
    complaints.forEach(c => {
        if (c.location === facilityName) {
            const isPending = (c.status || 'Pending') === 'Pending';
            const cat = (c.category || '').toLowerCase();
            
            let affectsOrg = cat.includes('organik') && !cat.includes('anorganik');
            let affectsInorg = cat.includes('anorganik') && !cat.includes('campur') && !cat.includes('organik & anorganik');
            
            if (cat.includes('campur') || cat.includes('organik & anorganik') || cat.includes('penuh') || cat === 'pemilahan sampah' || cat.includes('lainnya')) {
                affectsOrg = true;
                affectsInorg = true;
            } else if (!affectsOrg && !affectsInorg) {
                affectsOrg = true;
            }

            if (wasteType === 'organik' && affectsOrg) {
                if (isPending) {
                    currentState = 'unsorted';
                    pendingComplaint = c;
                    isMixedPending = affectsInorg;
                } else if (c.status === 'Selesai' && currentState === 'neutral') {
                    currentState = 'sorted';
                    sortedComplaint = c;
                    isMixedSorted = affectsInorg;
                }
            }
            if (wasteType === 'anorganik' && affectsInorg) {
                if (isPending) {
                    currentState = 'unsorted';
                    pendingComplaint = c;
                    isMixedPending = affectsOrg;
                } else if (c.status === 'Selesai' && currentState === 'neutral') {
                    currentState = 'sorted';
                    sortedComplaint = c;
                    isMixedSorted = affectsOrg;
                }
            }
        }
    });

    // 2. Fitur Undo: Jika diklik pada tombol yang sama, kembalikan ke netral
    if (currentState === targetStatus) {
        if (currentState === 'unsorted' && pendingComplaint) {
            if (isMixedPending) {
                pendingComplaint.category = wasteType === 'organik' ? 'Sampah Anorganik Belum Dipilah' : 'Sampah Organik Belum Dipilah';
                await saveToDatabase('complaints', pendingComplaint.id, pendingComplaint, true);
            } else {
                await deleteFromDatabase('complaints', pendingComplaint.id);
            }
        } else if (currentState === 'sorted' && sortedComplaint) {
            if (isMixedSorted) {
                sortedComplaint.category = wasteType === 'organik' ? 'Sampah Anorganik Sudah Dipilah' : 'Sampah Organik Sudah Dipilah';
                await saveToDatabase('complaints', sortedComplaint.id, sortedComplaint, true);
            } else {
                await deleteFromDatabase('complaints', sortedComplaint.id);
            }
        }
        return;
    }

    // 3. Proses penandaan baru
    const actionDate = getQuickReportDate();

    if (targetStatus === 'sorted') {
        if (pendingComplaint) {
            if (isMixedPending) {
                pendingComplaint.category = wasteType === 'organik' ? 'Sampah Anorganik Belum Dipilah' : 'Sampah Organik Belum Dipilah';
                pendingComplaint.response = pendingComplaint.response ? pendingComplaint.response + ` | ${wasteType} sudah dipilah.` : `${wasteType} sudah dipilah.`;
                await saveToDatabase('complaints', pendingComplaint.id, pendingComplaint, true);
            } else {
                pendingComplaint.status = 'Selesai';
                pendingComplaint.response = 'Selesai dipilah (Tandai Cepat).';
                await saveToDatabase('complaints', pendingComplaint.id, pendingComplaint, true);
            }
        } else {
            const compData = {
                id: Date.now().toString(),
                reporter: 'Admin/Operator (Pemeriksaan Rutin)',
                role: isAdmin ? 'TIM Adiwiyata' : 'Kader Adiwiyata',
                contact: '',
                location: facilityName,
                category: wasteType === 'organik' ? 'Sampah Organik Sudah Dipilah' : 'Sampah Anorganik Sudah Dipilah',
                desc: 'Telah diperiksa dan dipilah dengan baik.',
                status: 'Selesai',
                response: 'Diverifikasi bersih.',
                createdAt: actionDate
            };
            await saveToDatabase('complaints', compData.id, compData, false);
        }
    } else if (targetStatus === 'unsorted') {
        // Hapus atau Ubah status 'Selesai' jika sebelumnya sudah dipilah
        if (sortedComplaint) {
            if (isMixedSorted) {
                sortedComplaint.category = wasteType === 'organik' ? 'Sampah Anorganik Sudah Dipilah' : 'Sampah Organik Sudah Dipilah';
                await saveToDatabase('complaints', sortedComplaint.id, sortedComplaint, true);
            } else {
                await deleteFromDatabase('complaints', sortedComplaint.id);
            }
        }
        
        let categoryName = wasteType === 'organik' ? 'Sampah Organik Belum Dipilah' : 'Sampah Anorganik Belum Dipilah';
        
        const compData = {
            id: Date.now().toString(),
            reporter: 'Admin/Operator (Pemeriksaan Rutin)',
            role: isAdmin ? 'TIM Adiwiyata' : 'Kader Adiwiyata',
            contact: '',
            location: facilityName,
            category: categoryName,
            desc: 'Terpantau sampah belum dipilah (Tandai Cepat).',
            status: 'Pending',
            response: '',
            createdAt: actionDate
        };
        await saveToDatabase('complaints', compData.id, compData, false);
    }
}

window.openDetailComplaintForFacility = function(facilityName) {
    if (!isAdmin && !isOperator) {
        Swal.fire({
            icon: 'warning',
            title: 'Akses Ditolak',
            text: 'Silakan login terlebih dahulu untuk dapat membuat Laporan Detail.',
            background: 'rgba(30, 41, 59, 0.95)',
            color: '#f8fafc'
        });
        return;
    }
    if (DOM.addComplaintBtn) DOM.addComplaintBtn.click();
    setTimeout(() => {
        const locSelect = document.getElementById('complaintLocation');
        if (locSelect) {
            locSelect.value = facilityName;
        }
    }, 100);
};

window.markAllSorted = async function() {
    if (!isAdmin && !isOperator) {
        alert('Silakan login terlebih dahulu untuk memperbarui status pemilahan sampah secara massal.');
        return;
    }
    if (confirm("Apakah Anda yakin ingin menandai SELURUH fasilitas sebagai 'Sudah Terpilah Rapi'?")) {
        let batchUpdated = false;
        const actionDate = getQuickReportDate();
        
        // 1. Selesaikan semua laporan yang masih Pending (khusus yang terkait sampah)
        complaints.forEach(c => {
            if ((c.status || 'Pending') === 'Pending') {
                const cat = (c.category || '').toLowerCase();
                if (cat.includes('organik') || cat.includes('campur') || cat === 'pemilahan sampah' || cat.includes('penuh') || cat.includes('lainnya')) {
                    c.status = 'Selesai';
                    c.response = 'Selesai dipilah massal.';
                    batchUpdated = true;
                }
            }
        });

        // 2. Tandai fasilitas yang belum ada riwayat 'Selesai'
        facilities.forEach(fac => {
            let isSorted = false;
            complaints.forEach(c => {
                if (c.location === fac && c.status === 'Selesai') {
                    const cat = (c.category || '').toLowerCase();
                    let affectsOrg = cat.includes('organik') && !cat.includes('anorganik');
                    let affectsInorg = cat.includes('anorganik') && !cat.includes('campur') && !cat.includes('organik & anorganik');
                    if (cat.includes('campur') || cat.includes('organik & anorganik') || cat.includes('penuh') || cat === 'pemilahan sampah' || cat.includes('lainnya')) {
                        affectsOrg = true;
                        affectsInorg = true;
                    }
                    if (affectsOrg && affectsInorg) {
                        isSorted = true;
                    }
                }
            });

            if (!isSorted) {
                const compData = {
                    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
                    reporter: 'Admin/Operator (Pemeriksaan Rutin)',
                    role: isAdmin ? 'TIM Adiwiyata' : 'Kader Adiwiyata',
                    contact: '',
                    location: fac,
                    category: 'Pemilahan Sampah',
                    desc: 'Telah diperiksa dan dipilah secara massal.',
                    status: 'Selesai',
                    response: 'Diverifikasi bersih (Massal).',
                    createdAt: actionDate
                };
                complaints.unshift(compData);
                batchUpdated = true;
            }
        });

        if (batchUpdated) {
            localStorage.setItem('sardas_complaints', JSON.stringify(complaints));
            renderComplaints();
            if (gasConfig && gasConfig.isConfigured()) {
                saveToDatabase('settings', 'complaints_batch', complaints, true).catch(() => {});
            }
            alert("Seluruh ruangan berhasil ditandai sudah terpilah!");
        } else {
            alert("Semua ruangan sudah dalam keadaan terpilah rapi!");
        }
    }
};

window.markAllUnsorted = async function() {
    if (!isAdmin && !isOperator) {
        alert('Silakan login terlebih dahulu untuk memperbarui status pemilahan sampah secara massal.');
        return;
    }
    if (confirm("Apakah Anda yakin ingin menandai SELURUH fasilitas sebagai 'Belum Dipilah'?")) {
        let batchUpdated = false;
        const actionDate = getQuickReportDate();

        // Tandai seluruh fasilitas dengan log Pending baru jika belum ada
        facilities.forEach(fac => {
            let isUnsorted = false;
            complaints.forEach(c => {
                if (c.location === fac && (c.status || 'Pending') === 'Pending') {
                    const cat = (c.category || '').toLowerCase();
                    let affectsOrg = cat.includes('organik') && !cat.includes('anorganik');
                    let affectsInorg = cat.includes('anorganik') && !cat.includes('campur') && !cat.includes('organik & anorganik');
                    if (cat.includes('campur') || cat.includes('organik & anorganik') || cat.includes('penuh') || cat === 'pemilahan sampah' || cat.includes('lainnya')) {
                        affectsOrg = true;
                        affectsInorg = true;
                    }
                    if (affectsOrg && affectsInorg) {
                        isUnsorted = true;
                    }
                }
            });

            if (!isUnsorted) {
                // Hapus yang Selesai di fasilitas ini agar tertimpa Belum
                for (let i = complaints.length - 1; i >= 0; i--) {
                    let c = complaints[i];
                    if (c.location === fac && c.status === 'Selesai') {
                        complaints.splice(i, 1);
                    }
                }
                
                const compData = {
                    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
                    reporter: 'Admin/Operator (Pemeriksaan Rutin)',
                    role: isAdmin ? 'TIM Adiwiyata' : 'Kader Adiwiyata',
                    contact: '',
                    location: fac,
                    category: 'Sampah Organik & Anorganik Belum Dipilah',
                    desc: 'Terpantau sampah belum dipilah (Massal).',
                    status: 'Pending',
                    response: '',
                    createdAt: actionDate
                };
                complaints.unshift(compData);
                batchUpdated = true;
            }
        });

        if (batchUpdated) {
            localStorage.setItem('sardas_complaints', JSON.stringify(complaints));
            renderComplaints();
            if (gasConfig && gasConfig.isConfigured()) {
                saveToDatabase('settings', 'complaints_batch', complaints, true).catch(() => {});
            }
            alert("Seluruh ruangan berhasil ditandai belum dipilah!");
        } else {
            alert("Semua ruangan sudah dalam keadaan belum dipilah!");
        }
    }
};

window.clearAllStatus = async function() {
    if (!isAdmin && !isOperator) {
        alert('Silakan login terlebih dahulu untuk membersihkan status secara massal.');
        return;
    }
    if (confirm("Apakah Anda yakin ingin MENGHAPUS / MEMBERSIHKAN semua status pilihan (Sudah/Belum)?")) {
        let batchUpdated = false;

        for (let i = complaints.length - 1; i >= 0; i--) {
            let c = complaints[i];
            if (c.reporter === 'Admin/Operator (Pemeriksaan Rutin)') {
                // Hapus data hasil massal
                complaints.splice(i, 1);
                batchUpdated = true;
            } else if (c.response === 'Selesai dipilah massal.') {
                // Kembalikan ke Pending jika sebelumnya diselesaikan massal
                c.status = 'Pending';
                c.response = '';
                batchUpdated = true;
            }
        }

        if (batchUpdated) {
            localStorage.setItem('sardas_complaints', JSON.stringify(complaints));
            renderComplaints();
            if (typeof gasConfig !== 'undefined' && gasConfig && gasConfig.isConfigured()) {
                if (typeof saveToDatabase === 'function') {
                    saveToDatabase('settings', 'complaints_batch', complaints, true).catch(() => {});
                }
            }
            alert("Seluruh status ruangan (massal) berhasil dibersihkan!");
        } else {
            alert("Tidak ada status massal yang dapat dibersihkan.");
        }
    }
};

function openPublicComplaintEdit(comp) {
    if (!comp) return;
    DOM.complaintForm.reset();
    document.getElementById('complaintFormId').value = comp.id;
    document.getElementById('complaintModalTitle').textContent = '✏️ Edit Laporan Pengaduan Saya';
    document.getElementById('complaintReporter').value = comp.reporter || '';
    document.getElementById('complaintRole').value = comp.role || 'Siswa';
    document.getElementById('complaintContact').value = comp.contact || '';
    document.getElementById('complaintLocation').value = comp.location || '';
    document.getElementById('complaintCategory').value = comp.category || 'Lainnya';
    document.getElementById('complaintDesc').value = comp.desc || '';
    
    const imgUrl = comp.imageUrl || comp.image || '';
    const urlInput = document.getElementById('complaintImageUrl');
    const prevContainer = document.getElementById('complaintImagePreview');
    const prevImg = document.getElementById('complaintPreviewImg');
    if (urlInput) urlInput.value = imgUrl;
    if (imgUrl && prevImg && prevContainer) {
        prevImg.src = imgUrl;
        prevContainer.classList.remove('hidden');
    } else if (prevContainer) {
        prevContainer.classList.add('hidden');
    }
    DOM.complaintModal.classList.remove('hidden');
}

function openComplaintAdminModal(comp) {
    if (!comp) return;
    document.getElementById('complaintAdminId').value = comp.id;
    document.getElementById('complaintAdminStatus').value = comp.status || 'Pending';
    document.getElementById('complaintAdminResponse').value = comp.response || '';
    DOM.complaintAdminModal.classList.remove('hidden');
}

function showEventDetail(event, dateStr) {
    document.getElementById('detailTitle').textContent = event.title;
    const dateObj = new Date(event.date);
    let pureDateStr = dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (event.endDate) {
        const endObj = new Date(event.endDate);
        const endStr = endObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        pureDateStr = `${pureDateStr} s.d. ${endStr}`;
    }

    const facDisplay = Array.isArray(event.facility) ? event.facility.join(', ') : event.facility;

    document.getElementById('detailDate').textContent = pureDateStr;
    document.getElementById('detailTime').textContent = event.time || '-';
    document.getElementById('detailFacility').textContent = facDisplay || '-';
    document.getElementById('detailOrganizer').textContent = event.organizer;
    document.getElementById('detailCP').textContent = event.cp || '-';
    document.getElementById('detailNomorSurat').textContent = event.nomorSurat || '-';
    document.getElementById('detailParticipants').textContent = event.participants || '0';
    document.getElementById('detailCommittee').textContent = event.committee || '0';

    const techList = document.getElementById('detailTechnical');
    techList.innerHTML = '';
    if (event.technical) {
        const items = event.technical.split(',');
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.trim();
            techList.appendChild(li);
        });
    }

    const detailFormationContainer = document.getElementById('detailFormationContainer');
    const detailFormationImg = document.getElementById('detailFormationImg');
    if (event.formationImg) {
        detailFormationImg.src = event.formationImg;
        detailFormationContainer.classList.remove('hidden');
    } else {
        detailFormationImg.src = '';
        detailFormationContainer.classList.add('hidden');
    }

    const existingHighlights = document.querySelectorAll('.map-highlight');
    existingHighlights.forEach(el => el.remove());

    if (event.facility) {
        let selectedFacs = [];
        if (Array.isArray(event.facility)) {
            selectedFacs = event.facility;
        } else if (typeof event.facility === 'string') {
            selectedFacs = event.facility.split(',').map(f => f.trim());
        }

        selectedFacs.forEach(fac => {
            const normalizedFac = normalizeFacilityName(fac);
            if (mapCoordinates[normalizedFac]) {
                const coords = mapCoordinates[normalizedFac];
                const highlight = document.createElement('div');
                highlight.className = 'map-highlight';
                highlight.style.top = coords.top;
                highlight.style.left = coords.left;
                highlight.style.width = coords.width;
                highlight.style.height = coords.height;
                DOM.mapWrapper.appendChild(highlight);
            }
        });
    }

    DOM.detailPanel.classList.add('open');
    DOM.panelOverlay.classList.add('active');
}

function updateAccessControlUI() {
    if (isAdmin || isOperator) {
        sessionStorage.setItem('sisarna_operator', 'true');
        if (DOM.adminLoginBtn) DOM.adminLoginBtn.classList.add('hidden');
        if (DOM.adminLogoutBtn) DOM.adminLogoutBtn.classList.remove('hidden');
        if (DOM.tabConsumablesBtn) DOM.tabConsumablesBtn.classList.remove('hidden');
    } else {
        sessionStorage.removeItem('sisarna_operator');
        sessionStorage.removeItem('sisarna_admin');
        if (DOM.adminLoginBtn) DOM.adminLoginBtn.classList.remove('hidden');
        if (DOM.adminLogoutBtn) DOM.adminLogoutBtn.classList.add('hidden');
        if (DOM.tabConsumablesBtn) {
            DOM.tabConsumablesBtn.classList.add('hidden');
            if (DOM.tabConsumablesBtn.classList.contains('active')) {
                if (DOM.tabSarprasBtn) DOM.tabSarprasBtn.click();
            }
        }
    }

    const adminStatusText = document.getElementById('adminStatusText');

    if (isAdmin) {
        sessionStorage.setItem('sisarna_admin', 'true');
        document.body.classList.add('admin-mode');
        if (DOM.adminActions) DOM.adminActions.classList.remove('hidden');
        if (DOM.adminVehicleActions) DOM.adminVehicleActions.classList.remove('hidden');
        if (DOM.adminConsumableActions) DOM.adminConsumableActions.classList.remove('hidden');
        if (adminStatusText) adminStatusText.textContent = "Keluar (Admin)";
        enableCmsEditing();
    } else {
        sessionStorage.removeItem('sisarna_admin');
        document.body.classList.remove('admin-mode');
        if (DOM.adminActions) DOM.adminActions.classList.add('hidden');
        if (DOM.adminVehicleActions) DOM.adminVehicleActions.classList.add('hidden');
        if (DOM.adminConsumableActions) DOM.adminConsumableActions.classList.add('hidden');
        if (adminStatusText) adminStatusText.textContent = isOperator ? "Keluar (Operator)" : "Keluar";
        disableCmsEditing();
    }

    renderApp();
}

function toggleAdminMode(state) {
    isAdmin = state;
    if (isAdmin) isOperator = true;
    updateAccessControlUI();
}

function enableCmsEditing() {
    DOM.cmsEditables.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.addEventListener('blur', handleCmsEdit);
    });
}

function disableCmsEditing() {
    DOM.cmsEditables.forEach(el => {
        el.setAttribute('contenteditable', 'false');
        el.removeEventListener('blur', handleCmsEdit);
    });
}

async function handleCmsEdit(e) {
    const el = e.target;
    const key = el.getAttribute('data-cms-key');
    const newText = el.textContent.trim();

    if (cmsContent[key] !== newText) {
        cmsContent[key] = newText;
        await saveToDatabase('settings', 'cms', cmsContent);
    }
}

// --- Rekap & Cetak Laporan Logic ---
function renderKopSuratUI() {
    const gov = document.getElementById('kopGovName');
    const dept = document.getElementById('kopDeptName');
    const school = document.getElementById('kopSchoolName');
    const sub = document.getElementById('kopSubTitle');
    const addr = document.getElementById('kopAddress');
    const cont = document.getElementById('kopContact');

    const pTitle = document.getElementById('principalTitleText');
    const pName = document.getElementById('principalNameText');
    const pNip = document.getElementById('principalNipText');
    const sTitle = document.getElementById('staffTitleText');
    const sName = document.getElementById('staffNameText');
    const sNip = document.getElementById('staffNipText');

    if (gov) gov.textContent = kopSuratConfig.govName || "PEMERINTAH PROVINSI JAWA BARAT";
    if (dept) dept.textContent = kopSuratConfig.deptName || "DINAS PENDIDIKAN";
    if (school) school.textContent = kopSuratConfig.schoolName || "SMAN 2 CIAMIS";
    if (sub) sub.textContent = kopSuratConfig.subTitle || "";
    if (addr) addr.textContent = kopSuratConfig.address || "";
    if (cont) cont.textContent = kopSuratConfig.contact || "";

    if (pTitle) pTitle.textContent = kopSuratConfig.principalTitle || "Kepala SMAN 2 Ciamis";
    if (pName) pName.textContent = kopSuratConfig.principalName || "Drs. H. Nurdin, M.Pd.";
    if (pNip) pNip.textContent = kopSuratConfig.principalNip || "-";
    if (sTitle) sTitle.textContent = kopSuratConfig.staffTitle || "Ketua Adiwiyata";
    if (sName) sName.textContent = kopSuratConfig.staffName || "H. Endang Rahmat, S.Pd., M.Pd.";
    if (sNip) sNip.textContent = kopSuratConfig.staffNip || "-";
}

function populateKopSuratForm() {
    const iGov = document.getElementById('inputGovName');
    const iDept = document.getElementById('inputDeptName');
    const iSchool = document.getElementById('inputSchoolName');
    const iSub = document.getElementById('inputSubTitle');
    const iAddr = document.getElementById('inputAddress');
    const iCont = document.getElementById('inputContact');
    const iPTitle = document.getElementById('inputPrincipalTitle');
    const iPName = document.getElementById('inputPrincipalName');
    const iPNip = document.getElementById('inputPrincipalNip');
    const iSTitle = document.getElementById('inputStaffTitle');
    const iSName = document.getElementById('inputStaffName');
    const iSNip = document.getElementById('inputStaffNip');

    if (iGov) iGov.value = kopSuratConfig.govName || "";
    if (iDept) iDept.value = kopSuratConfig.deptName || "";
    if (iSchool) iSchool.value = kopSuratConfig.schoolName || "";
    if (iSub) iSub.value = kopSuratConfig.subTitle || "";
    if (iAddr) iAddr.value = kopSuratConfig.address || "";
    if (iCont) iCont.value = kopSuratConfig.contact || "";
    if (iPTitle) iPTitle.value = kopSuratConfig.principalTitle || "";
    if (iPName) iPName.value = kopSuratConfig.principalName || "";
    if (iPNip) iPNip.value = kopSuratConfig.principalNip || "";
    if (iSTitle) iSTitle.value = kopSuratConfig.staffTitle || "";
    if (iSName) iSName.value = kopSuratConfig.staffName || "";
    if (iSNip) iSNip.value = kopSuratConfig.staffNip || "";
}

async function saveKopSuratConfig() {
    const iGov = document.getElementById('inputGovName');
    const iDept = document.getElementById('inputDeptName');
    const iSchool = document.getElementById('inputSchoolName');
    const iSub = document.getElementById('inputSubTitle');
    const iAddr = document.getElementById('inputAddress');
    const iCont = document.getElementById('inputContact');
    const iPTitle = document.getElementById('inputPrincipalTitle');
    const iPName = document.getElementById('inputPrincipalName');
    const iPNip = document.getElementById('inputPrincipalNip');
    const iSTitle = document.getElementById('inputStaffTitle');
    const iSName = document.getElementById('inputStaffName');
    const iSNip = document.getElementById('inputStaffNip');

    kopSuratConfig = {
        govName: iGov ? iGov.value.trim() : "PEMERINTAH PROVINSI JAWA BARAT",
        deptName: iDept ? iDept.value.trim() : "DINAS PENDIDIKAN",
        schoolName: iSchool ? iSchool.value.trim() : "SMAN 2 CIAMIS",
        subTitle: iSub ? iSub.value.trim() : "",
        address: iAddr ? iAddr.value.trim() : "",
        contact: iCont ? iCont.value.trim() : "",
        principalTitle: iPTitle ? iPTitle.value.trim() : "Kepala SMAN 2 Ciamis",
        principalName: iPName ? iPName.value.trim() : "",
        principalNip: iPNip ? iPNip.value.trim() : "-",
        staffTitle: iSTitle ? iSTitle.value.trim() : "Ketua Adiwiyata",
        staffName: iSName ? iSName.value.trim() : "H. Endang Rahmat, S.Pd., M.Pd.",
        staffNip: iSNip ? iSNip.value.trim() : "-"
    };

    localStorage.setItem('sardas_kop_surat', JSON.stringify(kopSuratConfig));
    renderKopSuratUI();
    await saveToDatabase('settings', 'kopSurat', kopSuratConfig);
    alert('Kop Surat & Penandatangan berhasil diperbarui dan tersimpan permanen!');
    const editContainer = document.getElementById('editKopContainer');
    if (editContainer) editContainer.classList.add('hidden');
}

function updateTitiMangsaUI() {
    const placeInput = document.getElementById('reportPlaceInput');
    const dateInput = document.getElementById('reportDateInput');

    const place = (placeInput && placeInput.value.trim()) ? placeInput.value.trim() : 'Ciamis';

    let dateObj = new Date();
    if (dateInput && dateInput.value) {
        const parts = dateInput.value.split('-');
        if (parts.length === 3) {
            dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        }
    }

    const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const sDate = document.getElementById('reportSignDate');
    const sPlace = document.getElementById('reportSignPlace');

    if (sDate) sDate.textContent = formattedDate;
    if (sPlace) sPlace.textContent = place;
}

function openReportModal() {
    const reportModal = document.getElementById('reportModal');
    const panelOverlay = document.getElementById('panelOverlay');
    if (reportModal) {
        reportModal.classList.remove('hidden');
        if (panelOverlay) panelOverlay.classList.add('active');

        const dateInput = document.getElementById('reportDateInput');
        if (dateInput && !dateInput.value) {
            const todayISO = new Date().toISOString().split('T')[0];
            dateInput.value = todayISO;
        }
        updateTitiMangsaUI();

        renderKopSuratUI();
        populateKopSuratForm();

        const typeSel = document.getElementById('reportTypeSelect');
        const activeType = typeSel ? typeSel.value : 'events';
        renderReportTable(activeType);
    }
}

function renderReportTable(type) {
    const header = document.getElementById('reportTableHeader');
    const body = document.getElementById('reportTableBody');
    const titleHeading = document.getElementById('reportTitleHeading');
    const subHeading = document.getElementById('reportSubHeading');
    if (!header || !body) return;

    header.innerHTML = '';
    body.innerHTML = '';

    if (type === 'events') {
        if (titleHeading) titleHeading.textContent = 'Laporan Jadwal Penggunaan Sarana & Prasarana';
        if (subHeading) subHeading.textContent = `Total: ${events.length} Kegiatan Terjadwal`;

        header.innerHTML = `
            <tr>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; width: 40px; text-align: center;">No</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Tanggal & Waktu</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Nama Acara / Kegiatan</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Fasilitas / Lokasi</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Penyelenggara</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Kebutuhan Teknis</th>
            </tr>
        `;

        let sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
        if (sorted.length === 0) {
            body.innerHTML = '<tr><td colspan="6" style="padding: 16px; text-align: center; color: #64748b;">Belum ada jadwal kegiatan.</td></tr>';
            return;
        }

        sorted.forEach((e, idx) => {
            const fac = Array.isArray(e.facility) ? e.facility.join(', ') : (e.facility || '-');
            const d = new Date(e.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            const time = e.time ? ` (${e.time})` : '';
            body.innerHTML += `
                <tr>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${d}${time}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 600;">${e.title || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${fac}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${e.organizer || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${e.technical || '-'}</td>
                </tr>
            `;
        });
    } else if (type === 'consumables') {
        if (titleHeading) titleHeading.textContent = 'Laporan Stok Barang Habis Pakai';
        if (subHeading) subHeading.textContent = `Total: ${consumables.length} Jenis Barang`;

        header.innerHTML = `
            <tr>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; width: 40px; text-align: center;">No</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Nama Barang</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Kategori</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">Stok Saat Ini</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">Min. Stok</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Satuan</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Lokasi Gudang</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">Status</th>
            </tr>
        `;

        if (consumables.length === 0) {
            body.innerHTML = '<tr><td colspan="8" style="padding: 16px; text-align: center; color: #64748b;">Belum ada data barang.</td></tr>';
            return;
        }

        consumables.forEach((c, idx) => {
            const isLow = c.stock <= (c.minStock || 0);
            const statusBadge = isLow ? '<span style="color: #dc2626; font-weight: bold;">⚠️ Kritis</span>' : '<span style="color: #16a34a;">Aman</span>';
            body.innerHTML += `
                <tr>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 600;">${c.name || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${c.category || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${c.stock}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${c.minStock || 0}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${c.unit || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${c.location || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${statusBadge}</td>
                </tr>
            `;
        });
    } else if (type === 'consumable_logs') {
        if (titleHeading) titleHeading.textContent = 'Laporan Riwayat Mutasi Barang Habis Pakai';
        if (subHeading) subHeading.textContent = `Total: ${consumableLogs.length} Transaksi`;

        header.innerHTML = `
            <tr>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; width: 40px; text-align: center;">No</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Tanggal</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">Jenis Mutasi</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Nama Barang</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">Jumlah Qty</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Penerima / Pemasok</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Keperluan / Catatan</th>
            </tr>
        `;

        if (consumableLogs.length === 0) {
            body.innerHTML = '<tr><td colspan="7" style="padding: 16px; text-align: center; color: #64748b;">Belum ada riwayat mutasi.</td></tr>';
            return;
        }

        consumableLogs.forEach((l, idx) => {
            const isOut = l.type === 'OUT';
            const badge = isOut ? '<span style="color: #dc2626; font-weight: bold;">KELUAR</span>' : '<span style="color: #16a34a; font-weight: bold;">MASUK</span>';
            body.innerHTML += `
                <tr>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${l.date || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${badge}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 600;">${l.itemName || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${l.quantity}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${l.actor || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${l.notes || '-'}</td>
                </tr>
            `;
        });
    } else if (type === 'vehicles') {
        if (titleHeading) titleHeading.textContent = 'Laporan Kondisi & Perawatan Kendaraan Operasional';
        if (subHeading) subHeading.textContent = `Total: ${vehicles.length} Unit Kendaraan`;

        header.innerHTML = `
            <tr>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; width: 40px; text-align: center;">No</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Nama Kendaraan</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Plat Nomor</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Jenis</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">Status</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">KM Saat Ini</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Catatan Perbaikan</th>
            </tr>
        `;

        if (vehicles.length === 0) {
            body.innerHTML = '<tr><td colspan="7" style="padding: 16px; text-align: center; color: #64748b;">Belum ada data kendaraan.</td></tr>';
            return;
        }

        vehicles.forEach((v, idx) => {
            body.innerHTML += `
                <tr>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 600;">${v.name || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${v.plate || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${v.type || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${v.status || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${v.km ? v.km.toLocaleString('id-ID') : 0} KM</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${v.notes || '-'}</td>
                </tr>
            `;
        });
    } else if (type === 'pemilahan_sampah') {
        const sDate = document.getElementById('reportStartDate');
        const eDate = document.getElementById('reportEndDate');
        const catFilter = document.getElementById('reportCategorySelect');
        
        let start = null;
        if (sDate && sDate.value) {
            start = new Date(sDate.value + 'T00:00:00');
        }
        let end = null;
        if (eDate && eDate.value) {
            end = new Date(eDate.value + 'T23:59:59');
        }
        const cat = (catFilter && catFilter.value) ? catFilter.value : 'all';

        let filteredComplaints = complaints.filter(cp => {
            if (!cp) return false;
            let matchDate = true;
            if (cp.createdAt) {
                const cpDate = new Date(cp.createdAt);
                if (start && cpDate < start) matchDate = false;
                if (end && cpDate > end) matchDate = false;
            }
            let matchCat = true;
            const cpCat = (cp.category || '').toLowerCase();
            
            // Filter out non-sampah data (like listrik, lampu, etc) from this specific report
            if (cpCat.includes('listrik') || cpCat.includes('lampu') || cpCat.includes('energi') || cpCat.includes('air') || cpCat.includes('penghijauan') || cpCat.includes('kelistrikan') || cpCat.includes('konservasi')) {
                matchCat = false;
            }

            if (cat !== 'all') {
                if (cat === 'organik' && !cpCat.includes('organik')) matchCat = false;
                if (cat === 'anorganik' && !cpCat.includes('anorganik')) matchCat = false;
                if (cat === 'organik' && cpCat.includes('anorganik') && !cpCat.includes('organik & anorganik') && !cpCat.includes('campur')) matchCat = false;
            }
            return matchDate && matchCat;
        });

        if (titleHeading) titleHeading.textContent = 'Laporan Rekapitulasi Pemilahan Sampah';
        if (subHeading) subHeading.textContent = `Total: ${filteredComplaints.length} Data (Periode: ${(start ? start.toLocaleDateString('id-ID') : 'Semua')}${(end ? ' s.d ' + end.toLocaleDateString('id-ID') : '')})`;

        header.innerHTML = `
            <tr>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; width: 40px; text-align: center;">No</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Tanggal Masuk</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Pelapor</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Lokasi Ruangan</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Kategori</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Deskripsi Pengaduan</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">Status</th>
            </tr>
        `;

        if (filteredComplaints.length === 0) {
            body.innerHTML = '<tr><td colspan="7" style="padding: 16px; text-align: center; color: #64748b;">Belum ada data pemilahan.</td></tr>';
            return;
        }

        filteredComplaints.forEach((cp, idx) => {
            body.innerHTML += `
                <tr>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${cp.createdAt ? new Date(cp.createdAt).toLocaleString('id-ID') : '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: 600;">${cp.reporter || '-'} (${cp.role || 'Warga'})</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${cp.location || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${cp.category || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${cp.desc || '-'}</td>
                    <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${cp.status || 'Pending'}</td>
                </tr>
            `;
        });
    } else if (['penghijauan', 'hemat_energi', 'konservasi_air', 'lainnya'].includes(type)) {
        if (titleHeading) {
            let t = '';
            if (type === 'penghijauan') t = 'Penghijauan';
            else if (type === 'hemat_energi') t = 'Hemat Energi';
            else if (type === 'konservasi_air') t = 'Konservasi Air';
            else if (type === 'lainnya') t = 'Lainnya';
            titleHeading.textContent = 'Laporan Rekapitulasi ' + t;
        }
        if (subHeading) subHeading.textContent = `Total: 0 Data`;

        header.innerHTML = `
            <tr>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1; width: 40px; text-align: center;">No</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Tanggal</th>
                <th style="padding: 8px 10px; border: 1px solid #cbd5e1;">Keterangan</th>
            </tr>
        `;
        body.innerHTML = '<tr><td colspan="3" style="padding: 16px; text-align: center; color: #64748b;">Belum ada data untuk laporan ini.</td></tr>';
    }
}

function exportReportToCSV(type) {
    let rows = [];
    let filename = `Laporan_SAKOLA_${type}_${Date.now()}.csv`;

    if (type === 'events') {
        rows.push(['No', 'Tanggal', 'Jam', 'Nama Acara', 'Fasilitas', 'Penyelenggara', 'Kebutuhan Teknis']);
        events.forEach((e, idx) => {
            rows.push([idx + 1, e.date || '', e.time || '', e.title || '', Array.isArray(e.facility) ? e.facility.join('; ') : (e.facility || ''), e.organizer || '', e.technical || '']);
        });
    } else if (type === 'consumables') {
        rows.push(['No', 'Nama Barang', 'Kategori', 'Stok Saat Ini', 'Stok Minimum', 'Satuan', 'Lokasi Gudang']);
        consumables.forEach((c, idx) => {
            rows.push([idx + 1, c.name || '', c.category || '', c.stock || 0, c.minStock || 0, c.unit || '', c.location || '']);
        });
    } else if (type === 'consumable_logs') {
        rows.push(['No', 'Tanggal', 'Jenis Mutasi', 'Nama Barang', 'Jumlah Qty', 'Penanggung Jawab', 'Keperluan']);
        consumableLogs.forEach((l, idx) => {
            rows.push([idx + 1, l.date || '', l.type || '', l.itemName || '', l.quantity || 0, l.actor || '', l.notes || '']);
        });
    } else if (type === 'vehicles') {
        rows.push(['No', 'Nama Kendaraan', 'Nomor Plat', 'Jenis', 'Status', 'Kilometer', 'Catatan Perbaikan']);
        vehicles.forEach((v, idx) => {
            rows.push([idx + 1, v.name || '', v.plate || '', v.type || '', v.status || '', v.km || 0, v.notes || '']);
        });
    } else if (type === 'pemilahan_sampah') {
        rows.push(['No', 'Pelapor', 'Role', 'Lokasi', 'Kategori', 'Deskripsi', 'Status']);
        complaints.forEach((cp, idx) => {
            rows.push([idx + 1, cp.reporter || '', cp.role || '', cp.location || '', cp.category || '', cp.desc || '', cp.status || '']);
        });
    }

    let csvContent = "\uFEFF" + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.printReport = function() {
    window.print();
};

window.exportReportToExcel = function() {
    const tableHeader = document.getElementById('reportTableHeader');
    const tableBody = document.getElementById('reportTableBody');
    if (!tableHeader || !tableBody) return;

    let wb = XLSX.utils.book_new();
    
    // Create an array of arrays representing the sheet
    let ws_data = [];
    
    // Add title rows
    const typeSel = document.getElementById('reportTypeSelect');
    const activeType = typeSel ? typeSel.options[typeSel.selectedIndex].text : 'Laporan Rekapitulasi';
    ws_data.push([activeType]);
    ws_data.push([]);
    
    // Add Headers
    let headerRow = [];
    tableHeader.querySelectorAll('th').forEach(th => headerRow.push(th.innerText));
    ws_data.push(headerRow);
    
    // Add Body Rows
    tableBody.querySelectorAll('tr').forEach(tr => {
        let row = [];
        tr.querySelectorAll('td').forEach(td => row.push(td.innerText));
        if (row.length > 0) ws_data.push(row);
    });

    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    // Optionally auto-size columns a bit
    let wscols = headerRow.map(h => ({wch: Math.max(h.length, 15)}));
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Rekap Laporan");
    
    const d = new Date();
    const dateStr = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    XLSX.writeFile(wb, `Laporan_SAKOLA_${dateStr}.xlsx`);
};

// --- Event Listeners ---
function setupEventListeners() {
    // Reset nilai input pencarian agar tidak terisi otomatis username oleh browser password manager
    ['searchInput', 'vehicleSearchInput', 'complaintSearchInput'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
            // Reset bila ada autofill yang masuk terlambat setelah render
            setTimeout(() => { if (input.value && !input.getAttribute('data-user-typed')) input.value = ''; }, 300);
            input.addEventListener('input', () => input.setAttribute('data-user-typed', 'true'));
        }
    });

    // Switch Navigation 5 Tabs
    // Switch Navigation — Dinamis (HOMPIMPAH & NADI HIJAU)
    const tabHompimpahBtn = document.getElementById('tabHompimpahBtn');
    const tabNadiHijauBtn = document.getElementById('tabNadiHijauBtn');
    if (tabHompimpahBtn && DOM.complaintsSection) {
        tabHompimpahBtn.addEventListener('click', () => {
            tabHompimpahBtn.classList.add('active');
            if (tabNadiHijauBtn) tabNadiHijauBtn.classList.remove('active');
            DOM.complaintsSection.classList.remove('hidden');
            if (DOM.nadiHijauSection) DOM.nadiHijauSection.classList.add('hidden');
            renderComplaints();
        });
    }
    if (tabNadiHijauBtn && DOM.complaintsSection) {
        tabNadiHijauBtn.addEventListener('click', () => {
            tabNadiHijauBtn.classList.add('active');
            if (tabHompimpahBtn) tabHompimpahBtn.classList.remove('active');
            if (DOM.nadiHijauSection) DOM.nadiHijauSection.classList.remove('hidden');
            DOM.complaintsSection.classList.add('hidden');
        });
    }

    // Filter Pills Pengaduan
    document.querySelectorAll('.filter-pills .pill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-pills .pill-btn').forEach(p => p.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const filterVal = e.currentTarget.getAttribute('data-filter');
            renderComplaints(DOM.complaintSearchInput ? DOM.complaintSearchInput.value : "", filterVal);
        });
    });

    if (DOM.complaintSearchInput) {
        DOM.complaintSearchInput.addEventListener('input', (e) => {
            renderComplaints(e.target.value, currentComplaintStatusFilter);
        });
    }

    if (DOM.addComplaintBtn) {
        DOM.addComplaintBtn.addEventListener('click', () => {
            if (!isAdmin && !isOperator) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Akses Ditolak',
                    text: 'Silakan login terlebih dahulu untuk dapat membuat Laporan Detail.',
                    background: 'rgba(30, 41, 59, 0.95)',
                    color: '#f8fafc'
                });
                return;
            }
            DOM.complaintForm.reset();
            const formIdInput = document.getElementById('complaintFormId');
            if (formIdInput) formIdInput.value = '';
            const titleEl = document.getElementById('complaintModalTitle');
            if (titleEl) titleEl.textContent = '📢 Buat Laporan Detail';
            
            const imgInput = document.getElementById('complaintImageInput');
            const urlInput = document.getElementById('complaintImageUrl');
            const prevContainer = document.getElementById('complaintImagePreview');
            const prevImg = document.getElementById('complaintPreviewImg');
            if (imgInput) imgInput.value = '';
            if (urlInput) urlInput.value = '';
            if (prevImg) prevImg.src = '';
            if (prevContainer) prevContainer.classList.add('hidden');

            const locSelect = document.getElementById('complaintLocation');
            if (locSelect) {
                const currentVal = locSelect.value;
                locSelect.innerHTML = '<option value="">-- Pilih Lokasi Fasilitas / Ruangan --</option>';
                const allFacs = (facilities && facilities.length > 0) ? facilities : (typeof DEFAULT_FACILITIES !== 'undefined' ? DEFAULT_FACILITIES : []);
                const sorted = [...allFacs].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));
                sorted.forEach(f => {
                    const opt = document.createElement('option');
                    opt.value = f;
                    opt.textContent = f;
                    locSelect.appendChild(opt);
                });
                if (currentVal) locSelect.value = currentVal;
            }

            DOM.complaintModal.classList.remove('hidden');
        });
    }
    if (DOM.closeComplaintModal) {
        DOM.closeComplaintModal.addEventListener('click', () => {
            DOM.complaintModal.classList.add('hidden');
        });
    }
    if (DOM.cancelComplaintBtn) {
        DOM.cancelComplaintBtn.addEventListener('click', () => {
            DOM.complaintModal.classList.add('hidden');
        });
    }

function setupImageUploadHandler() {
    const fileInput = document.getElementById('complaintImageInput');
    const urlInput = document.getElementById('complaintImageUrl');
    const previewContainer = document.getElementById('complaintImagePreview');
    const previewImg = document.getElementById('complaintPreviewImg');
    const removeBtn = document.getElementById('removeComplaintImgBtn');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_SIZE = 500;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    if (urlInput) urlInput.value = compressedBase64;
                    if (previewImg) previewImg.src = compressedBase64;
                    if (previewContainer) previewContainer.classList.remove('hidden');
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            if (fileInput) fileInput.value = '';
            if (urlInput) urlInput.value = '';
            if (previewImg) previewImg.src = '';
            if (previewContainer) previewContainer.classList.add('hidden');
        });
    }
}

    setupImageUploadHandler();

    if (DOM.complaintForm) {
        DOM.complaintForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const editId = document.getElementById('complaintFormId') ? document.getElementById('complaintFormId').value : '';
            const existingComp = editId ? (complaints.find(c => c.id === editId) || {}) : {};

            const dateInput = document.getElementById('complaintDate');
            let complaintDateIso = existingComp.createdAt || new Date().toISOString();
            if (dateInput && dateInput.value) {
                const userDate = new Date(dateInput.value);
                userDate.setHours(new Date().getHours(), new Date().getMinutes());
                complaintDateIso = userDate.toISOString();
            }

            const compData = {
                ...existingComp,
                reporter: document.getElementById('complaintReporter').value || 'Warga Sekolah',
                role: document.getElementById('complaintRole').value || 'Siswa',
                contact: document.getElementById('complaintContact') ? document.getElementById('complaintContact').value : '',
                location: document.getElementById('complaintLocation').value || '-',
                category: document.getElementById('complaintCategory').value || 'Lainnya',
                desc: document.getElementById('complaintDesc').value || '-',
                imageUrl: document.getElementById('complaintImageUrl') ? document.getElementById('complaintImageUrl').value : '',
                status: existingComp.status || 'Pending',
                createdAt: complaintDateIso,
                response: existingComp.response || ''
            };

            const btn = document.getElementById('saveComplaintBtn');
            btn.disabled = true;
            btn.textContent = 'Menyimpan...';

            try {
                if (editId) {
                    await saveToDatabase('complaints', editId, compData, true);
                    alert("Laporan pengaduan Anda berhasil diperbarui!");
                } else {
                    await saveToDatabase('complaints', null, compData, false);
                    alert("Laporan pengaduan Anda berhasil dikirim! Tim Sarpras akan segera memverifikasi dan menindaklanjuti laporan Anda.");
                }

                // Reset Form & Input Foto
                DOM.complaintForm.reset();
                if (document.getElementById('complaintFormId')) document.getElementById('complaintFormId').value = '';
                const imgInput = document.getElementById('complaintImageInput');
                const urlInput = document.getElementById('complaintImageUrl');
                const prevContainer = document.getElementById('complaintImagePreview');
                const prevImg = document.getElementById('complaintPreviewImg');
                if (imgInput) imgInput.value = '';
                if (urlInput) urlInput.value = '';
                if (prevImg) prevImg.src = '';
                if (prevContainer) prevContainer.classList.add('hidden');
                
                // Tutup Modal
                DOM.complaintModal.classList.add('hidden');

                // Otomatis Pindah ke Tab Pengaduan Warga Sekolah agar Papan Pemantauan Pengaduan Langsung Terbuka!
                if (DOM.tabHompimpahBtn) {
                    DOM.tabHompimpahBtn.click();
                }

                // Reset filter agar laporan baru di paling atas langsung terlihat
                currentComplaintStatusFilter = 'all';
                document.querySelectorAll('.filter-pills .pill-btn').forEach(p => {
                    if (p.getAttribute('data-filter') === 'all') p.classList.add('active');
                    else p.classList.remove('active');
                });
                if (DOM.complaintSearchInput) DOM.complaintSearchInput.value = '';

                // Render ulang pengaduan & scroll ke papan pemantauan
                renderComplaints();
                if (DOM.complaintsSection) {
                    DOM.complaintsSection.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (err) {
                console.error(err);
                alert("Gagal menyimpan laporan pengaduan.");
            } finally {
                btn.disabled = false;
                btn.textContent = 'Kirim Laporan';
            }
        });
    }

    if (DOM.closeComplaintAdminModal) {
        DOM.closeComplaintAdminModal.addEventListener('click', () => {
            DOM.complaintAdminModal.classList.add('hidden');
        });
    }
    if (DOM.cancelComplaintAdminBtn) {
        DOM.cancelComplaintAdminBtn.addEventListener('click', () => {
            DOM.complaintAdminModal.classList.add('hidden');
        });
    }

    if (DOM.complaintAdminForm) {
        DOM.complaintAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('complaintAdminId').value;
            const existingComp = complaints.find(c => c.id === id) || {};
            const updatedData = {
                ...existingComp,
                status: document.getElementById('complaintAdminStatus').value,
                response: document.getElementById('complaintAdminResponse').value
            };

            const btn = document.getElementById('saveComplaintAdminBtn');
            btn.disabled = true;
            btn.textContent = 'Menyimpan...';

            try {
                await saveToDatabase('complaints', id, updatedData, true);
                DOM.complaintAdminModal.classList.add('hidden');
            } catch (err) {
                console.error(err);
                alert("Gagal memperbarui status pengaduan.");
            } finally {
                btn.disabled = false;
                btn.textContent = 'Simpan Status';
            }
        });
    }

    if (DOM.vehicleSearchInput) {
        DOM.vehicleSearchInput.addEventListener('input', (e) => {
            renderVehicles(e.target.value);
        });
    }

    if (DOM.addVehicleBtn) {
        DOM.addVehicleBtn.addEventListener('click', () => {
            openVehicleModal();
        });
    }
    if (DOM.closeVehicleModal) {
        DOM.closeVehicleModal.addEventListener('click', () => {
            DOM.vehicleModal.classList.add('hidden');
        });
    }
    if (DOM.cancelVehicleBtn) {
        DOM.cancelVehicleBtn.addEventListener('click', () => {
            DOM.vehicleModal.classList.add('hidden');
        });
    }

    if (DOM.vehicleForm) {
        DOM.vehicleForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const vehData = {
                name: document.getElementById('vehicleName').value,
                plate: document.getElementById('vehiclePlate').value,
                type: document.getElementById('vehicleType').value,
                status: document.getElementById('vehicleStatus').value,
                km: document.getElementById('vehicleKm').value ? parseInt(document.getElementById('vehicleKm').value) : null,
                kmNextOil: document.getElementById('vehicleKmNextOil').value ? parseInt(document.getElementById('vehicleKmNextOil').value) : null,
                lastOilDate: document.getElementById('vehicleLastOilDate').value || null,
                nextOilDate: document.getElementById('vehicleNextOilDate').value || null,
                taxDate: document.getElementById('vehicleTaxDate').value || null,
                plateDate: document.getElementById('vehiclePlateDate').value || null,
                notes: document.getElementById('vehicleNotes').value || ''
            };

            const id = document.getElementById('vehicleId').value;
            const btn = document.getElementById('saveVehicleBtn');
            btn.disabled = true;
            btn.textContent = 'Menyimpan...';

            try {
                if (id) {
                    await saveToDatabase('vehicles', id, vehData, true);
                } else {
                    await saveToDatabase('vehicles', null, vehData, false);
                }
                DOM.vehicleModal.classList.add('hidden');
            } catch (err) {
                console.error(err);
                alert("Gagal menyimpan data kendaraan.");
            } finally {
                btn.disabled = false;
                btn.textContent = 'Simpan Kendaraan';
            }
        });
    }

    // --- Event Listeners Modul Barang Habis Pakai (Consumables) ---
    if (DOM.consumableSearchInput) {
        DOM.consumableSearchInput.addEventListener('input', (e) => {
            renderConsumables(e.target.value, DOM.consumableCategoryFilter ? DOM.consumableCategoryFilter.value : 'all');
        });
    }
    if (DOM.consumableCategoryFilter) {
        DOM.consumableCategoryFilter.addEventListener('change', (e) => {
            renderConsumables(DOM.consumableSearchInput ? DOM.consumableSearchInput.value : '', e.target.value);
        });
    }

    const tableBtn = document.getElementById('consumableTableViewBtn');
    const cardBtn = document.getElementById('consumableCardViewBtn');
    const statTotal = document.getElementById('cardStatTotal');
    const statLow = document.getElementById('cardStatLowStock');
    const statMut = document.getElementById('cardStatMutations');
    const clearFilterBtn = document.getElementById('clearConsumableFilterBtn');

    if (tableBtn) {
        tableBtn.addEventListener('click', () => {
            consumablesViewMode = 'table';
            renderConsumables(DOM.consumableSearchInput ? DOM.consumableSearchInput.value : '', DOM.consumableCategoryFilter ? DOM.consumableCategoryFilter.value : 'all');
        });
    }
    if (cardBtn) {
        cardBtn.addEventListener('click', () => {
            consumablesViewMode = 'card';
            renderConsumables(DOM.consumableSearchInput ? DOM.consumableSearchInput.value : '', DOM.consumableCategoryFilter ? DOM.consumableCategoryFilter.value : 'all');
        });
    }

    if (statTotal) {
        statTotal.addEventListener('click', () => {
            consumablesStockFilter = 'all';
            renderConsumables(DOM.consumableSearchInput ? DOM.consumableSearchInput.value : '', DOM.consumableCategoryFilter ? DOM.consumableCategoryFilter.value : 'all');
        });
    }
    if (statLow) {
        statLow.addEventListener('click', () => {
            consumablesStockFilter = (consumablesStockFilter === 'low' ? 'all' : 'low');
            renderConsumables(DOM.consumableSearchInput ? DOM.consumableSearchInput.value : '', DOM.consumableCategoryFilter ? DOM.consumableCategoryFilter.value : 'all');
        });
    }
    if (statMut) {
        statMut.addEventListener('click', () => {
            renderConsumableHistory();
            if (DOM.consumableHistoryModal) DOM.consumableHistoryModal.classList.remove('hidden');
        });
    }
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            consumablesStockFilter = 'all';
            renderConsumables(DOM.consumableSearchInput ? DOM.consumableSearchInput.value : '', DOM.consumableCategoryFilter ? DOM.consumableCategoryFilter.value : 'all');
        });
    }

    if (DOM.openPublicMultiOutBtn) {
        DOM.openPublicMultiOutBtn.addEventListener('click', () => openPublicMultiOutModal());
    }
    if (DOM.closePublicMultiOutModal) {
        DOM.closePublicMultiOutModal.addEventListener('click', () => DOM.publicMultiOutModal.classList.add('hidden'));
    }
    if (DOM.cancelPublicMultiOutBtn) {
        DOM.cancelPublicMultiOutBtn.addEventListener('click', () => DOM.publicMultiOutModal.classList.add('hidden'));
    }
    if (DOM.addConsumableRowBtn) {
        DOM.addConsumableRowBtn.addEventListener('click', () => addConsumableItemRow());
    }
    if (DOM.publicMultiOutForm) {
        DOM.publicMultiOutForm.addEventListener('submit', handlePublicMultiOutSubmit);
    }

    if (DOM.addConsumableItemBtn) {
        DOM.addConsumableItemBtn.addEventListener('click', () => openAdminConsumableModal());
    }
    if (DOM.closeAdminConsumableModal) {
        DOM.closeAdminConsumableModal.addEventListener('click', () => DOM.adminConsumableModal.classList.add('hidden'));
    }
    if (DOM.cancelAdminConsumableBtn) {
        DOM.cancelAdminConsumableBtn.addEventListener('click', () => DOM.adminConsumableModal.classList.add('hidden'));
    }
    if (DOM.adminConsumableForm) {
        DOM.adminConsumableForm.addEventListener('submit', handleAdminSaveConsumable);
    }

    if (DOM.adminRestockBtn) {
        DOM.adminRestockBtn.addEventListener('click', () => openAdminRestockModal());
    }
    if (DOM.closeAdminRestockModal) {
        DOM.closeAdminRestockModal.addEventListener('click', () => DOM.adminRestockModal.classList.add('hidden'));
    }
    if (DOM.cancelAdminRestockBtn) {
        DOM.cancelAdminRestockBtn.addEventListener('click', () => DOM.adminRestockModal.classList.add('hidden'));
    }
    if (DOM.adminRestockForm) {
        DOM.adminRestockForm.addEventListener('submit', handleAdminRestockSubmit);
    }

    if (DOM.viewConsumableHistoryBtn) {
        DOM.viewConsumableHistoryBtn.addEventListener('click', () => {
            renderConsumableHistory();
            DOM.consumableHistoryModal.classList.remove('hidden');
        });
    }
    if (DOM.closeConsumableHistoryModal) {
        DOM.closeConsumableHistoryModal.addEventListener('click', () => DOM.consumableHistoryModal.classList.add('hidden'));
    }

    document.getElementById('multiDayCheck').addEventListener('change', (e) => {
        const endDateGroup = document.getElementById('endDateGroup');
        const dateLabelMain = document.getElementById('dateLabelMain');
        if (e.target.checked) {
            endDateGroup.classList.remove('hidden');
            dateLabelMain.textContent = 'Mulai Tanggal';
            document.getElementById('eventEndDate').required = true;
        } else {
            endDateGroup.classList.add('hidden');
            dateLabelMain.textContent = 'Tanggal';
            document.getElementById('eventEndDate').required = false;
            document.getElementById('eventEndDate').value = '';
        }
    });

    DOM.searchInput.addEventListener('input', (e) => {
        renderEvents(e.target.value);
    });

    DOM.closeDetailBtn.addEventListener('click', () => {
        DOM.detailPanel.classList.remove('open');
        DOM.panelOverlay.classList.remove('active');
    });
    DOM.panelOverlay.addEventListener('click', () => {
        DOM.detailPanel.classList.remove('open');
        DOM.panelOverlay.classList.remove('active');
        DOM.loginModal.classList.add('hidden');
    });

    DOM.adminLoginBtn.addEventListener('click', () => {
        DOM.loginModal.classList.remove('hidden');
        DOM.panelOverlay.classList.add('active');
        setTimeout(() => {
            if (DOM.adminPassword) DOM.adminPassword.focus();
        }, 100);
    });
    DOM.closeLoginModal.addEventListener('click', () => {
        DOM.loginModal.classList.add('hidden');
        DOM.panelOverlay.classList.remove('active');
    });

    const loginForm = document.getElementById('loginForm');
    const handleLoginSubmit = async (e) => {
        if (e) e.preventDefault();
        const pwd = DOM.adminPassword ? DOM.adminPassword.value.trim() : '';
        if (!pwd) return;

        const submitBtn = document.getElementById('loginSubmitBtn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Memverifikasi...'; }

        let loginSuccess = false;
        let loginAsAdmin = false;

        // ── Coba verifikasi via GAS (dinamis) ────────────────────────────────
        if (window.gasConfig && window.gasConfig.isConfigured()) {
            try {
                // Cek sebagai admin dulu
                const adminMatch = await window.gasConfig.verifyPassword('admin', pwd);
                if (adminMatch === true) {
                    loginSuccess = true; loginAsAdmin = true;
                } else {
                    // Cek sebagai operator
                    const opMatch = await window.gasConfig.verifyPassword('operator', pwd);
                    if (opMatch === true) { loginSuccess = true; loginAsAdmin = false; }
                    else if (opMatch === null) {
                        // GAS tidak bisa dihubungi → fallback lokal
                        loginSuccess = null;
                    }
                }
            } catch (_) { loginSuccess = null; }
        } else {
            loginSuccess = null; // tidak terkonfigurasi → fallback lokal
        }

        // ── Fallback: password lokal ──────────────────────────────────────────
        if (loginSuccess === null) {
            if (pwd === 'Andalusia_2' || pwd === 'sarpras_satu') {
                loginSuccess = true; loginAsAdmin = true;
            } else if (pwd === 'sarpras_dua' || pwd === 'smandacis') {
                loginSuccess = true; loginAsAdmin = false;
            } else {
                loginSuccess = false;
            }
        }

        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Login'; }

        if (loginSuccess) {
            isAdmin = loginAsAdmin;
            isOperator = true;
            updateAccessControlUI();
            DOM.loginModal.classList.add('hidden');
            DOM.panelOverlay.classList.remove('active');
            DOM.adminPassword.value = '';
            Swal.fire({
                icon: 'success',
                title: 'Login Berhasil',
                text: isAdmin
                    ? 'Selamat datang, Admin! Semua fitur pengelolaan telah diaktifkan.'
                    : 'Selamat datang, Operator! Fitur pemantauan telah diaktifkan.',
                timer: 2000, showConfirmButton: false,
                background: 'rgba(15,23,42,0.95)', color: '#f8fafc'
            });
        } else {
            Swal.fire({
                icon: 'error', title: 'Akses Ditolak',
                text: 'Password salah. Silakan periksa kembali.',
                background: 'rgba(15,23,42,0.95)', color: '#f8fafc'
            });
        }
    };


    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    } else {
        DOM.loginSubmitBtn.addEventListener('click', handleLoginSubmit);
    }

    DOM.adminLogoutBtn.addEventListener('click', () => {
        isAdmin = false;
        isOperator = false;
        updateAccessControlUI();
        alert("Anda telah keluar dari akun. Tab Barang Habis Pakai dan fitur pengelola telah disembunyikan.");
    });

    DOM.addEventBtn.addEventListener('click', () => {
        openEventModal();
    });
    DOM.closeEventModal.addEventListener('click', () => {
        DOM.eventModal.classList.add('hidden');
    });
    DOM.cancelEventBtn.addEventListener('click', () => {
        DOM.eventModal.classList.add('hidden');
    });

    const formationInput = document.getElementById('eventFormationInput');
    if (formationInput) {
        formationInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                const rawResult = event.target.result;
                document.getElementById('eventFormationData').value = rawResult;
                document.getElementById('formationPreviewImg').src = rawResult;
                document.getElementById('formationPreviewContainer').classList.remove('hidden');

                const img = new Image();
                img.onload = function () {
                    try {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const maxDim = 800;
                        if (width > maxDim || height > maxDim) {
                            if (width > height) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            } else {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                            if (dataUrl && dataUrl.length < rawResult.length) {
                                document.getElementById('eventFormationData').value = dataUrl;
                                document.getElementById('formationPreviewImg').src = dataUrl;
                            }
                        }
                    } catch (err) {
                        console.warn('Kompresi gambar diabaikan:', err);
                    }
                };
                img.src = rawResult;
            };
            reader.readAsDataURL(file);
        });
    }

    const removeFormationBtn = document.getElementById('removeFormationBtn');
    if (removeFormationBtn) {
        removeFormationBtn.addEventListener('click', function () {
            if (document.getElementById('eventFormationInput')) document.getElementById('eventFormationInput').value = '';
            if (document.getElementById('eventFormationData')) document.getElementById('eventFormationData').value = '';
            if (document.getElementById('formationPreviewImg')) document.getElementById('formationPreviewImg').src = '';
            if (document.getElementById('formationPreviewContainer')) document.getElementById('formationPreviewContainer').classList.add('hidden');
        });
    }

    if (DOM.eventForm) {
        DOM.eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const selectedFacilities = facilityChoices ? (facilityChoices.getValue(true) || []) : [];
            const facString = Array.isArray(selectedFacilities) ? selectedFacilities.join(', ') : selectedFacilities;

            const eventData = {
                title: document.getElementById('eventTitle').value,
                nomorSurat: document.getElementById('eventNomorSurat').value,
                date: document.getElementById('eventDate').value,
                endDate: document.getElementById('multiDayCheck').checked ? document.getElementById('eventEndDate').value : null,
                time: document.getElementById('eventTime').value,
                facility: facString,
                organizer: document.getElementById('eventOrganizer').value,
                cp: document.getElementById('eventCP').value,
                participants: document.getElementById('eventParticipants').value,
                committee: document.getElementById('eventCommittee').value,
                technical: document.getElementById('eventTechnical').value,
                formationImg: document.getElementById('eventFormationData').value || null
            };

            const id = document.getElementById('eventId').value;
            const btn = document.getElementById('saveEventBtn');
            btn.disabled = true;
            btn.textContent = 'Menyimpan...';

            try {
                if (id) {
                    await saveToDatabase('events', id, eventData, true);
                } else {
                    await saveToDatabase('events', null, eventData, false);
                }
                DOM.eventModal.classList.add('hidden');
            } catch (error) {
                console.error(error);
                alert("Gagal menyimpan data.");
            } finally {
                btn.disabled = false;
                btn.textContent = 'Simpan';
            }
        });
    }

    if (DOM.manageFacilitiesBtn) {
        DOM.manageFacilitiesBtn.addEventListener('click', () => {
            DOM.facilitiesModal.classList.remove('hidden');
            renderFacilityAdminList();
        });
    }
    if (DOM.closeFacilitiesModal) {
        DOM.closeFacilitiesModal.addEventListener('click', () => {
            DOM.facilitiesModal.classList.add('hidden');
            DOM.newFacilityName.value = '';
            renderFacilityAdminList();
        });
    }

    DOM.newFacilityName.addEventListener('input', (e) => {
        renderFacilityAdminList(e.target.value);
    });

    DOM.addFacilityBtn.addEventListener('click', async () => {
        const newFac = DOM.newFacilityName.value.trim();
        if (!newFac) return;

        const normalizedNew = normalizeFacilityName(newFac);
        const exists = facilities.some(f => normalizeFacilityName(f) === normalizedNew);

        if (!exists) {
            facilities.push(newFac);
            DOM.newFacilityName.value = '';
            await saveToDatabase('settings', 'facilities', { list: facilities });
            renderFacilities();
        }
    });

    DOM.importFacilityBtn.addEventListener('click', () => {
        const file = DOM.csvFacilityInput.files[0];
        if (!file) {
            alert('Silakan pilih file CSV terlebih dahulu.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async function (e) {
            const text = e.target.result;
            const rawItems = text.split(/[\r\n,]+/);
            let addedCount = 0;

            rawItems.forEach(item => {
                const trimmed = item.trim().replace(/^["']|["']$/g, '');
                if (trimmed) {
                    const normalizedTrimmed = normalizeFacilityName(trimmed);
                    const exists = facilities.some(f => normalizeFacilityName(f) === normalizedTrimmed);
                    if (!exists) {
                        facilities.push(trimmed);
                        addedCount++;
                    }
                }
            });

            if (addedCount > 0) {
                await saveToDatabase('settings', 'facilities', { list: facilities });
                renderFacilities();
                alert(`Berhasil mengimpor ${addedCount} fasilitas baru!`);
            } else {
                alert('Tidak ada fasilitas baru yang ditambahkan (data kosong/duplikat).');
            }
            DOM.csvFacilityInput.value = '';
        };
        reader.readAsText(file);
    });

    if (DOM.quickAddFacilityBtn) {
        DOM.quickAddFacilityBtn.addEventListener('click', async () => {
            const newFac = DOM.quickAddFacilityInput.value.trim();
            if (!newFac) return;

            const normalizedNew = normalizeFacilityName(newFac);
            const exists = facilities.some(f => normalizeFacilityName(f) === normalizedNew);

            if (!exists) {
                facilities.push(newFac);
                DOM.quickAddFacilityInput.value = '';
                await saveToDatabase('settings', 'facilities', { list: facilities });
                renderFacilities();
                openMapEditorForFacility(newFac);
                alert(`Fasilitas "${newFac}" berhasil ditambahkan! Silakan atur letak kotaknya di peta.`);
            } else {
                alert(`Fasilitas "${newFac}" sudah ada di dalam daftar.`);
                openMapEditorForFacility(newFac);
            }
        });
    }

    if (DOM.cleanOrphanCoordsBtn) {
        DOM.cleanOrphanCoordsBtn.addEventListener('click', async () => {
            const validKeys = new Set(facilities.map(f => normalizeFacilityName(f)));
            let removedKeys = [];

            Object.keys(mapCoordinates).forEach(key => {
                if (!validKeys.has(key)) {
                    removedKeys.push(key);
                    delete mapCoordinates[key];
                }
            });

            if (removedKeys.length > 0) {
                await saveToDatabase('settings', 'mapCoordinates', { coords: mapCoordinates });
                populateMapEditorFacilitySelect("");
                alert(`Berhasil membersihkan ${removedKeys.length} kotak koordinat lama (${removedKeys.join(', ')})!`);
            } else {
                alert("Semua kotak koordinat di denah sudah sesuai dengan fasilitas aktif (tidak ada data lama).");
            }
        });
    }
}

function openEventModal(event = null) {
    DOM.eventForm.reset();
    if (facilityChoices) facilityChoices.removeActiveItems();
    document.getElementById('eventId').value = '';
    document.getElementById('eventModalTitle').textContent = 'Tambah Acara';
    document.getElementById('multiDayCheck').checked = false;
    document.getElementById('endDateGroup').classList.add('hidden');
    document.getElementById('dateLabelMain').textContent = 'Tanggal';
    document.getElementById('eventEndDate').required = false;
    if (document.getElementById('eventFormationInput')) document.getElementById('eventFormationInput').value = '';
    if (document.getElementById('eventFormationData')) document.getElementById('eventFormationData').value = '';
    if (document.getElementById('formationPreviewImg')) document.getElementById('formationPreviewImg').src = '';
    if (document.getElementById('formationPreviewContainer')) document.getElementById('formationPreviewContainer').classList.add('hidden');

    if (event) {
        document.getElementById('eventModalTitle').textContent = 'Edit Acara';
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventNomorSurat').value = event.nomorSurat || '';
        document.getElementById('eventDate').value = event.date;

        if (event.endDate) {
            document.getElementById('multiDayCheck').checked = true;
            document.getElementById('endDateGroup').classList.remove('hidden');
            document.getElementById('dateLabelMain').textContent = 'Mulai Tanggal';
            document.getElementById('eventEndDate').required = true;
            document.getElementById('eventEndDate').value = event.endDate;
        }

        document.getElementById('eventTime').value = event.time || '';
        if (event.facility && facilityChoices) {
            let facArr = [];
            if (Array.isArray(event.facility)) {
                facArr = event.facility;
            } else if (typeof event.facility === 'string') {
                facArr = event.facility.split(',').map(f => f.trim()).filter(Boolean);
            }
            facilityChoices.setChoiceByValue(facArr);
        }
        document.getElementById('eventOrganizer').value = event.organizer;
        document.getElementById('eventCP').value = event.cp || '';
        document.getElementById('eventParticipants').value = event.participants || '';
        document.getElementById('eventCommittee').value = event.committee || '';
        document.getElementById('eventTechnical').value = event.technical || '';
        if (event.formationImg) {
            document.getElementById('eventFormationData').value = event.formationImg;
            document.getElementById('formationPreviewImg').src = event.formationImg;
            document.getElementById('formationPreviewContainer').classList.remove('hidden');
        }
    }

    DOM.eventModal.classList.remove('hidden');
}

// --- Map Editor Logic ---
let isDragging = false;
let isResizing = false;
let dragStartX, dragStartY;
let initialLeft, initialTop, initialWidth, initialHeight;

function openMapEditorForFacility(facName = "") {
    DOM.mapEditorModal.classList.remove('hidden');
    populateMapEditorFacilitySelect(facName);
}

function populateMapEditorFacilitySelect(selectedFacName = "") {
    DOM.editorFacilitySelect.innerHTML = '<option value="">-- Pilih Fasilitas untuk Dipetakan --</option>';

    const sorted = [...facilities].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));
    const validKeys = new Set();

    sorted.forEach(fac => {
        const option = document.createElement('option');
        option.value = fac;
        const norm = normalizeFacilityName(fac);
        validKeys.add(norm);
        const hasCoords = !!mapCoordinates[norm];
        option.textContent = `${fac} ${hasCoords ? '📍' : ''}`;
        if (fac === selectedFacName || (selectedFacName && norm === normalizeFacilityName(selectedFacName))) {
            option.selected = true;
        }
        DOM.editorFacilitySelect.appendChild(option);
    });

    Object.keys(mapCoordinates).forEach(key => {
        if (!validKeys.has(key)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `⚠️ [Data Lama] ${key} 📍`;
            if (key === selectedFacName || key === normalizeFacilityName(selectedFacName)) {
                option.selected = true;
            }
            DOM.editorFacilitySelect.appendChild(option);
        }
    });

    DOM.editorFacilitySelect.dispatchEvent(new Event('change'));
}

function renderEditorBackgroundHighlights(activeFac = null) {
    const oldBg = DOM.mapEditorWrapper.querySelectorAll('.editor-bg-highlight');
    oldBg.forEach(el => el.remove());

    Object.keys(mapCoordinates).forEach(key => {
        if (key === activeFac) return;
        const coords = mapCoordinates[key];
        const highlight = document.createElement('div');
        highlight.className = 'map-highlight editor-bg-highlight';
        highlight.style.top = coords.top;
        highlight.style.left = coords.left;
        highlight.style.width = coords.width;
        highlight.style.height = coords.height;
        highlight.title = `${key} (Klik untuk pilih & edit/hapus)`;

        highlight.addEventListener('click', () => {
            const options = Array.from(DOM.editorFacilitySelect.options);
            const matchingOption = options.find(opt => normalizeFacilityName(opt.value) === key || opt.value === key);

            if (matchingOption) {
                DOM.editorFacilitySelect.value = matchingOption.value;
                DOM.editorFacilitySelect.dispatchEvent(new Event('change'));
            } else {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `⚠️ [Data Lama] ${key} 📍`;
                DOM.editorFacilitySelect.appendChild(option);
                DOM.editorFacilitySelect.value = key;
                DOM.editorFacilitySelect.dispatchEvent(new Event('change'));
            }
        });

        DOM.mapEditorWrapper.appendChild(highlight);
    });
}

DOM.mapEditorBtn.addEventListener('click', () => {
    openMapEditorForFacility();
});

DOM.closeMapEditorModal.addEventListener('click', () => {
    DOM.mapEditorModal.classList.add('hidden');
    DOM.editableHighlight.style.display = 'none';
    DOM.editorFacilitySelect.value = '';
    renderEditorBackgroundHighlights(null);
});

DOM.editorFacilitySelect.addEventListener('change', (e) => {
    const fac = e.target.value;
    if (!fac) {
        DOM.editableHighlight.style.display = 'none';
        DOM.deleteMapCoordsBtn.classList.add('hidden');
        renderEditorBackgroundHighlights(null);
        return;
    }

    const normalizedFac = normalizeFacilityName(fac);
    DOM.editableHighlight.style.display = 'block';
    renderEditorBackgroundHighlights(normalizedFac);

    const targetCoords = mapCoordinates[normalizedFac] || mapCoordinates[fac];

    if (targetCoords) {
        DOM.editableHighlight.style.top = targetCoords.top;
        DOM.editableHighlight.style.left = targetCoords.left;
        DOM.editableHighlight.style.width = targetCoords.width;
        DOM.editableHighlight.style.height = targetCoords.height;
        DOM.deleteMapCoordsBtn.classList.remove('hidden');
    } else {
        DOM.editableHighlight.style.top = '40%';
        DOM.editableHighlight.style.left = '40%';
        DOM.editableHighlight.style.width = '15%';
        DOM.editableHighlight.style.height = '15%';
        DOM.deleteMapCoordsBtn.classList.add('hidden');
    }
});

const handleDragStart = (clientX, clientY, target) => {
    if (target.classList.contains('resize-handle')) {
        isResizing = true;
    } else {
        isDragging = true;
    }

    dragStartX = clientX;
    dragStartY = clientY;

    initialLeft = parseFloat(DOM.editableHighlight.style.left) || 40;
    initialTop = parseFloat(DOM.editableHighlight.style.top) || 40;
    initialWidth = parseFloat(DOM.editableHighlight.style.width) || 15;
    initialHeight = parseFloat(DOM.editableHighlight.style.height) || 15;
};

const handleDragMove = (clientX, clientY) => {
    if (!isDragging && !isResizing) return;

    const wrapperRect = DOM.mapEditorWrapper.getBoundingClientRect();
    const dx = clientX - dragStartX;
    const dy = clientY - dragStartY;

    const dxPercent = (dx / wrapperRect.width) * 100;
    const dyPercent = (dy / wrapperRect.height) * 100;

    if (isDragging) {
        let newLeft = initialLeft + dxPercent;
        let newTop = initialTop + dyPercent;

        newLeft = Math.max(0, Math.min(newLeft, 100 - initialWidth));
        newTop = Math.max(0, Math.min(newTop, 100 - initialHeight));

        DOM.editableHighlight.style.left = newLeft + '%';
        DOM.editableHighlight.style.top = newTop + '%';
    } else if (isResizing) {
        let newWidth = initialWidth + dxPercent;
        let newHeight = initialHeight + dyPercent;

        newWidth = Math.max(2, Math.min(newWidth, 100 - initialLeft));
        newHeight = Math.max(2, Math.min(newHeight, 100 - initialTop));

        DOM.editableHighlight.style.width = newWidth + '%';
        DOM.editableHighlight.style.height = newHeight + '%';
    }
};

DOM.editableHighlight.addEventListener('mousedown', (e) => {
    handleDragStart(e.clientX, e.clientY, e.target);
    e.preventDefault();
});

DOM.editableHighlight.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }
}, { passive: true });

window.addEventListener('mousemove', (e) => {
    handleDragMove(e.clientX, e.clientY);
});

window.addEventListener('touchmove', (e) => {
    if ((isDragging || isResizing) && e.touches && e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

window.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
});

window.addEventListener('touchend', () => {
    isDragging = false;
    isResizing = false;
});

DOM.saveMapCoordsBtn.addEventListener('click', async () => {
    const fac = DOM.editorFacilitySelect.value;
    if (!fac) {
        window.alert("Pilih fasilitas terlebih dahulu.");
        return;
    }

    const normalizedFac = normalizeFacilityName(fac);
    const originalBtnContent = DOM.saveMapCoordsBtn.innerHTML;
    DOM.saveMapCoordsBtn.disabled = true;
    DOM.editorFacilitySelect.disabled = true;
    DOM.saveMapCoordsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

    mapCoordinates[normalizedFac] = {
        top: DOM.editableHighlight.style.top,
        left: DOM.editableHighlight.style.left,
        width: DOM.editableHighlight.style.width,
        height: DOM.editableHighlight.style.height
    };

    try {
        await saveToDatabase('settings', 'mapCoordinates', { coords: mapCoordinates });
    } finally {
        DOM.saveMapCoordsBtn.disabled = false;
        DOM.editorFacilitySelect.disabled = false;
        DOM.saveMapCoordsBtn.innerHTML = originalBtnContent;
    }

    populateMapEditorFacilitySelect(fac);
    renderFacilities();
    DOM.editorFacilitySelect.focus();
});

DOM.deleteMapCoordsBtn.addEventListener('click', async () => {
    const fac = DOM.editorFacilitySelect.value;
    if (!fac) return;

    if (!confirm(`Apakah Anda yakin ingin menghapus koordinat denah untuk: "${fac}"?`)) {
        return;
    }

    const normalizedFac = normalizeFacilityName(fac);
    delete mapCoordinates[normalizedFac];
    delete mapCoordinates[fac];

    await saveToDatabase('settings', 'mapCoordinates', { coords: mapCoordinates });

    alert(`Koordinat denah untuk "${fac}" berhasil dihapus.`);
    populateMapEditorFacilitySelect("");
    renderFacilities();
});

document.addEventListener('DOMContentLoaded', init);

// ═══════════════════════════════════════════════════════════════════════════
// GAS SYNC — Ambil semua data dari Google Spreadsheet saat startup
// ═══════════════════════════════════════════════════════════════════════════
async function loadGASData() {
    if (!window.gasConfig || !window.gasConfig.isConfigured()) return;
    window.gasConfig.setSyncStatus('syncing');
    try {
        const res = await fetch(window.gasConfig.webAppUrl + '?action=getAll', {
            signal: AbortSignal.timeout(15000)
        });
        const json = await res.json();
        if (json.status !== 'success') throw new Error(json.message || 'Gagal load data');

        const data = json.data;

        // ── Sinkronisasi Fasilitas ────────────────────────────────────────
        if (Array.isArray(data.fasilitas) && data.fasilitas.length > 0) {
            localStorage.setItem('sardas_facilities', JSON.stringify(data.fasilitas));
        }

        // ── Sinkronisasi PemilahanSampah ─────────────────────────────────
        if (Array.isArray(data.pemilahanSampah)) {
            // Konversi format GAS ke format lokal app
            const localReports = data.pemilahanSampah.map(r => ({
                id: r.id,
                type: 'pemilahan_sampah',
                tanggal: r.tanggal,
                lokasi: r.lokasi,
                status_organik: r.status_organik,
                status_anorganik: r.status_anorganik,
                petugas: r.petugas || '',
                catatan: r.catatan || '',
                updatedAt: r.updatedAt
            }));
            localStorage.setItem('sardas_reports', JSON.stringify(localReports));
        }

        // ── Sinkronisasi Settings / CMS ───────────────────────────────────
        if (data.settings && typeof data.settings === 'object') {
            Object.entries(data.settings).forEach(([key, val]) => {
                try {
                    localStorage.setItem('sardas_' + key, typeof val === 'object' ? JSON.stringify(val) : String(val));
                } catch (_) {}
            });
        }

        window.gasConfig.setSyncStatus('online');
        // Re-render setelah data dari GAS dimuat
        if (typeof renderFacilities === 'function') renderFacilities();
        if (typeof renderComplaints === 'function') renderComplaints();

    } catch (err) {
        console.warn('[GAS Sync] Gagal memuat data:', err.message);
        window.gasConfig.setSyncStatus('error');
    }
}

// ── Optimized Short-Polling (Real-time Sync) ──────────────────────────────────
let _pollGASTimer = null;
let _lastLocalUpdate = ''; // menyimpan timestamp dari server
async function checkGASUpdate() {
    if (!window.gasConfig || !window.gasConfig.isConfigured()) return;
    try {
        const res = await fetch(window.gasConfig.webAppUrl + '?action=checkUpdate', {
            signal: AbortSignal.timeout(5000)
        });
        const json = await res.json();
        if (json.status === 'success') {
            const serverLastUpdate = json.lastUpdate;
            if (serverLastUpdate && serverLastUpdate !== _lastLocalUpdate) {
                _lastLocalUpdate = serverLastUpdate;
                // Ada update baru dari pengguna lain, tarik semua data
                await loadGASData();
            }
        }
    } catch (err) {
        // Abaikan error polling (offline/timeout), jangan ubah UI secara agresif
    }
}

function startGASPolling() {
    if (!window.gasConfig || !window.gasConfig.isConfigured()) return;
    if (_pollGASTimer) clearInterval(_pollGASTimer);
    // Polling ringan setiap 5 detik (hanya baca 1 cell)
    _pollGASTimer = setInterval(checkGASUpdate, 5000);
}

// Simpan ke GAS setelah save lokal
async function syncDocToGAS(collection, docId, data, isUpdate = false) {
    if (!window.gasConfig || !window.gasConfig.isConfigured()) return;
    try {
        await fetch(window.gasConfig.webAppUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'saveDoc', collection, docId, data, isUpdate }),
            signal: AbortSignal.timeout(10000)
        });
    } catch (err) {
        console.warn('[GAS Sync] syncDocToGAS gagal:', err.message);
    }
}

window.loadGASData = loadGASData;
window.syncDocToGAS = syncDocToGAS;

// Inisialisasi GAS saat load
document.addEventListener('DOMContentLoaded', async () => {
    // Expose isAdmin ke window agar gas-config.js bisa akses
    Object.defineProperty(window, 'isAdmin', {
        get: () => typeof isAdmin !== 'undefined' ? isAdmin : false,
        configurable: true
    });

    if (window.gasConfig && window.gasConfig.isConfigured()) {
        await loadGASData();
        startGASPolling();
    } else {
        if (window.gasConfig) window.gasConfig.setSyncStatus('idle');
    }
});


// ==========================================
// NADI HIJAU (PEPELING) LOGIC
// ==========================================

function pepelingOpenUploadModal() {
    document.getElementById('pepelingUploadModal').classList.remove('hidden');
    document.getElementById('pepelingUploadModal').style.display = 'flex';
}

function pepelingCloseUploadModal() {
    document.getElementById('pepelingUploadModal').classList.add('hidden');
    document.getElementById('pepelingUploadModal').style.display = 'none';
    pepelingResetForm();
}

function pepelingResetForm() {
    document.getElementById('pepeling-submission-form').reset();
    document.getElementById('pepeling-analyzer-panel').style.display = 'none';
    document.getElementById('pepeling-drop-zone').style.display = 'block';
    document.getElementById('pepeling-video-preview').src = '';
    const btn = document.getElementById('pepeling-submit-btn');
    btn.disabled = true;
    btn.textContent = 'VERIFIKASI AI BELUM SELESAI';
    btn.style.cursor = 'not-allowed';
    btn.style.background = '#1a5c28';
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('pepeling-file-input');
    const dropZone = document.getElementById('pepeling-drop-zone');
    const analyzerPanel = document.getElementById('pepeling-analyzer-panel');
    const videoPreview = document.getElementById('pepeling-video-preview');
    const durationVal = document.getElementById('pepeling-duration-val');
    const secondsVal = document.getElementById('pepeling-seconds-val');
    const statusBadge = document.getElementById('pepeling-status-badge');
    const submitBtn = document.getElementById('pepeling-submit-btn');
    const mgmpSelect = document.getElementById('mgmp-select');

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                if (file.type.startsWith('video/')) {
                    handleVideoSelected(file);
                } else {
                    alert('Mohon upload file video (MP4, MOV, MKV)');
                }
            }
        });
    }

    function handleVideoSelected(file) {
        dropZone.style.display = 'none';
        analyzerPanel.style.display = 'block';
        analyzerPanel.classList.remove('hidden');
        
        statusBadge.textContent = 'Menganalisis...';
        statusBadge.className = 'status-badge warning';
        submitBtn.disabled = true;
        submitBtn.textContent = 'VERIFIKASI AI BELUM SELESAI';
        submitBtn.style.background = '#6c757d';

        const fileURL = URL.createObjectURL(file);
        videoPreview.src = fileURL;

        videoPreview.onloadedmetadata = function() {
            const duration = Math.floor(videoPreview.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            
            durationVal.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            secondsVal.textContent = duration;

            // Simulate AI Analysis Delay
            setTimeout(() => {
                if (duration > 0) {
                    statusBadge.textContent = 'Video Terverifikasi';
                    statusBadge.className = 'status-badge success';
                    statusBadge.style.background = '#d4edda';
                    statusBadge.style.color = '#155724';
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'KIRIM LAPORAN PEPELING';
                    submitBtn.style.background = '#1a5c28';
                    submitBtn.style.cursor = 'pointer';
                } else {
                    statusBadge.textContent = 'Durasi Terlalu Singkat';
                    statusBadge.className = 'status-badge danger';
                    statusBadge.style.background = '#f8d7da';
                    statusBadge.style.color = '#721c24';
                }
            }, 1500); // 1.5 seconds mock analysis
        };
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const mgmp = mgmpSelect.value;
            if (!mgmp) {
                alert('Silakan pilih Forum MGMP Pendamping terlebih dahulu!');
                return;
            }

            alert('Laporan berhasil dikirim! Menunggu validasi admin.');
            
            // Show star logic
            const starId = 'star-' + mgmp;
            const starEl = document.getElementById(starId);
            if (starEl) {
                starEl.style.display = 'inline-block';
            }

            pepelingCloseUploadModal();
        });
    }
});
// Fungsi untuk membuka mini-modal aksi pada peta
window.openMapActionModal = function(facilityName) {
    const modal = document.getElementById('mapActionModal');
    const title = document.getElementById('mapActionTitle');
    const orgGroup = document.getElementById('mapActionOrganicGroup');
    const inorgGroup = document.getElementById('mapActionInorganicGroup');
    
    if(!modal || !title || !orgGroup || !inorgGroup) return;

    title.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${facilityName}`;

    let isOrgUnsorted = false;
    let isInorgUnsorted = false;
    
    complaints.forEach(c => {
        if (c.location === facilityName && (c.status || 'Pending') === 'Pending') {
            const cat = (c.category || '').toLowerCase();
            if (cat.includes('organik') && !cat.includes('anorganik')) {
                isOrgUnsorted = true;
            } else if (cat.includes('anorganik')) {
                isInorgUnsorted = true;
                if(cat.includes('campur') || cat.includes('organik & anorganik')) {
                    isOrgUnsorted = true;
                }
            } else if (cat.includes('penuh') || cat === 'pemilahan sampah' || cat.includes('lainnya')) {
                isOrgUnsorted = true;
                isInorgUnsorted = true;
            } else {
                isOrgUnsorted = true;
            }
        }
    });

    const generateToggles = (wasteType, isUnsorted) => `
        <button type="button" style="flex:1; justify-content:center; padding: 10px;" class="waste-toggle-btn btn-sorted ${!isUnsorted ? 'active' : ''}" onclick="handleMapActionToggle('${facilityName}', '${wasteType}', 'sorted')"><i class="fas fa-check"></i> Sudah</button>
        <button type="button" style="flex:1; justify-content:center; padding: 10px;" class="waste-toggle-btn btn-unsorted ${isUnsorted ? 'active' : ''}" onclick="handleMapActionToggle('${facilityName}', '${wasteType}', 'unsorted')"><span class="dot"></span> Belum</button>
    `;

    orgGroup.innerHTML = generateToggles('organik', isOrgUnsorted);
    inorgGroup.innerHTML = generateToggles('anorganik', isInorgUnsorted);

    modal.classList.remove('hidden');
};

window.handleMapActionToggle = async function(facilityName, wasteType, targetStatus) {
    if (typeof handleQuickToggleWaste === 'function') {
        await handleQuickToggleWaste(facilityName, wasteType, targetStatus);
    }
    openMapActionModal(facilityName);
};

// Inisialisasi event listener Lapor Cepat setelah DOM siap
setTimeout(() => {
    const quickReportSearchInput = document.getElementById('quickReportSearchInput');
    const quickFilterBtns = document.querySelectorAll('.quick-report-filter-pills .pill-btn');
    const markAllSortedBtn = document.getElementById('markAllSortedBtn');

    if (quickReportSearchInput) {
        // Populate options for dropdown
        const allFacs = [...facilities].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }));
        allFacs.forEach(fac => {
            const opt = document.createElement('option');
            opt.value = fac;
            opt.textContent = fac;
            quickReportSearchInput.appendChild(opt);
        });

        quickReportSearchInput.addEventListener('change', (e) => {
            const filterValue = e.target.value;
            const activeFilter = document.querySelector('.quick-report-filter-pills .pill-btn.active');
            const statusFilter = activeFilter ? activeFilter.getAttribute('data-quick-filter') : 'all';
            
            if (typeof renderQuickReportList === 'function') {
                renderQuickReportList(filterValue, statusFilter);
            }
        });
    }

    if (quickFilterBtns) {
        quickFilterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                quickFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const statusFilter = btn.getAttribute('data-quick-filter');
                const filterValue = quickReportSearchInput ? quickReportSearchInput.value : '';
                
                if (typeof renderQuickReportList === 'function') {
                    renderQuickReportList(filterValue, statusFilter);
                }
            });
        });
    }

    if (markAllSortedBtn) {
        markAllSortedBtn.addEventListener('click', () => {
            if (typeof window.markAllSorted === 'function') {
                window.markAllSorted();
            }
        });
    }

    const markAllUnsortedBtn = document.getElementById('markAllUnsortedBtn');
    if (markAllUnsortedBtn) {
        markAllUnsortedBtn.addEventListener('click', () => {
            if (typeof window.markAllUnsorted === 'function') {
                window.markAllUnsorted();
            }
        });
    }
    
    const clearAllStatusBtn = document.getElementById('clearAllStatusBtn');
    if (clearAllStatusBtn) {
        clearAllStatusBtn.addEventListener('click', () => {
            if (typeof window.clearAllStatus === 'function') {
                window.clearAllStatus();
            }
        });
    }
}, 1000);
