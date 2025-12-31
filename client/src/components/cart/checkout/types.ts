export interface CustomerInfo {
    name: string;
    phone: string;
    governorate: string;
    address: string;
    notes: string;
}

export interface Governorate {
    value: string;
    label: string;
}

export const GOVERNORATES: Governorate[] = [
    { value: "baghdad", label: "بغداد" },
    { value: "basra", label: "البصرة" },
    { value: "ninawa", label: "نينوى" },
    { value: "erbil", label: "أربيل" },
    { value: "duhok", label: "دهوك" },
    { value: "sulaymaniyah", label: "السليمانية" },
    { value: "kirkuk", label: "كركوك" },
    { value: "anbar", label: "الأنبار" },
    { value: "diyala", label: "ديالى" },
    { value: "babil", label: "بابل" },
    { value: "karbala", label: "كربلاء" },
    { value: "najaf", label: "النجف" },
    { value: "wasit", label: "واسط" },
    { value: "qadisiyah", label: "القادسية" },
    { value: "maysan", label: "ميسان" },
    { value: "dhi_qar", label: "ذي قار" },
    { value: "muthanna", label: "المثنى" },
    { value: "saladin", label: "صلاح الدين" }
];
