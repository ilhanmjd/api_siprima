# SIPRIMA Backend API Requirements

> **Documentation for Backend Development**  
> This document outlines all API endpoint requirements for the SIPRIMA (Sistem Informasi Prima) frontend application.  
> Use this as a reference guide for implementing or verifying backend endpoints.

<<<<<<< HEAD
> ✅ **Implementation Status: 100% Complete**  
> All core API endpoints have been implemented. All 62 documented endpoints are available and functional.  
> Last verified: December 12, 2025

=======
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c
---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Authentication](#authentication)
3. [Role-Based Requirements](#role-based-requirements)
4. [API Endpoints by Module](#api-endpoints-by-module)
5. [Data Models](#data-models)
6. [Status Flows](#status-flows)
7. [Missing Endpoints](#missing-endpoints)

---

## 🎯 System Overview

SIPRIMA is an asset and risk management system with 4 main user roles:

| Role | Responsibility | Access Level |
|------|----------------|--------------|
| **Dinas User** | Submit asset, risk, and maintenance requests | Create, Read own data |
| **Verifikator** | Verify and approve/reject submissions | Read all, Update status |
| **Diskominfo** | IT department - Final asset deletion approval | Read all, Delete assets |
| **Auditor** | System-wide monitoring and reporting | Read-only (all data) |

---

## 🔐 Authentication

### Base Configuration
- **Authentication Method**: Laravel Sanctum (Bearer Token)
- **Base URL**: Configurable via `VITE_URL_API` environment variable
- **Default**: `http://127.0.0.1:8000`

### Required Endpoints

#### 1. Login
```http
POST /api/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "user@example.com",
      "role": "dinas" // or "verifikator" | "diskominfo" | "auditor"
    },
    "access_token": "1|abcdefghijklmnopqrstuvwxyz",
    "token_type": "Bearer"
  }
}

Response 422:
{
  "message": "The provided credentials are incorrect.",
  "errors": {
    "email": ["The provided credentials are incorrect."]
  }
}
```

#### 2. Logout
```http
POST /api/logout
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 3. Get Current User
```http
GET /api/user
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "user@example.com",
      "role": "dinas"
    }
  }
}
```

---

## 👥 Role-Based Requirements

### 1. DINAS USER (✅ Fully Implemented)

**Capabilities:**
- Create assets (3-step form + confirmation)
- Submit risk identification
- Submit risk treatment plans
- Request maintenance
- Request asset deletion
- View own submission status

**Status:** All endpoints are implemented and integrated.

---

### 2. VERIFIKATOR (✅ Fully Implemented)

**Capabilities:**
- View all pending submissions
- Approve/reject assets
- Approve/reject risks
- Approve/reject risk treatments
- Approve/reject maintenance requests
- Review asset deletion requests

**Status:** All endpoints are implemented and integrated.

---

### 3. DISKOMINFO (❌ Needs Implementation)

**Capabilities:**
- View system-wide statistics
- Final approval for asset deletions
- Monitor all asset activities
- Execute actual asset deletion after approval

**Status:** ⚠️ Endpoints exist but UI integration is missing.

**Required Pages:**
1. `Dashboard-diskominfo.jsx` - Needs real statistics
2. `notifikasi-diskominfo.jsx` - Needs full workflow implementation

---

### 4. AUDITOR (❌ Needs Implementation)

**Capabilities:**
- Monitor all system activities
- View aggregated statistics
- Generate reports
- Risk heatmap visualization
- Per-dinas performance tracking

**Status:** ⚠️ Endpoints exist but data aggregation & visualization missing.

**Required Pages:**
1. `DashboardAuditor.jsx` - Needs complete data integration

---

## 📡 API Endpoints by Module

### MODULE: Assets

#### List All Assets
```http
GET /api/assets
Authorization: Bearer {token}

Query Parameters:
- kategori_id (optional): integer - Filter by category
- status (optional): string - Filter by status (pending|diterima|ditolak|pemeliharaan)
- dinas_id (optional): integer - Filter by dinas

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kategori_id": 1,
      "subkategori_id": 1,
      "lokasi_id": 1,
      "penanggungjawab_id": 1,
      "dinas_id": 1,
      "nama": "Laptop Dell Latitude 5420",
      "deskripsi": "Laptop untuk keperluan kerja",
      "tgl_perolehan": "2024-06-01T10:00:00Z",
      "nilai_perolehan": 12000000,
      "kondisi": "baik", // baik | rusak-ringan | rusak-berat
      "lampiran_bukti": "bukti.pdf",
      "is_usage": "active", // active | inactive
      "status": "diterima", // pending | diterima | ditolak | pemeliharaan
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "kategori": { "id": 1, "nama": "Hardware" },
      "subkategori": { "id": 1, "nama": "Laptop" },
      "lokasi": { "id": 1, "nama": "Lantai 2 Ruang IT" },
      "penanggungjawab": { "id": 1, "nama": "John Doe" }
    }
  ]
}
```

#### Get Single Asset
```http
GET /api/assets/{id}
Authorization: Bearer {token}

Response 200: Same structure as list item
Response 404: Asset not found
```

#### Create Asset
```http
POST /api/assets
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "kategori_id": 1,
  "subkategori_id": 1,
  "lokasi_id": 1,
  "penanggungjawab_id": 1,
  "dinas_id": 1,
  "nama": "Laptop Dell Latitude 5420",
  "deskripsi": "Laptop untuk keperluan kerja",
  "tgl_perolehan": "2024-06-01 10:00:00",
  "nilai_perolehan": 12000000,
  "kondisi": "baik",
  "lampiran_bukti": "bukti.pdf",
  "is_usage": "active"
}

Response 201:
{
  "success": true,
  "message": "Asset berhasil dibuat",
  "data": { /* asset object */ }
}
```

#### Update Asset (For Verification)
```http
PUT /api/assets/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request (Approve):
{
  "status": "diterima"
}

Request (Reject):
{
  "status": "ditolak",
  "alasan_penolakan": "Dokumentasi tidak lengkap"
}

Response 200:
{
  "success": true,
  "message": "Asset berhasil diupdate",
  "data": { /* updated asset */ }
}
```

#### Delete Asset
```http
DELETE /api/assets/{id}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Asset berhasil dihapus"
}

Response 404:
{
  "success": false,
  "message": "Asset tidak ditemukan"
}
```

**⚠️ Note:** Delete should only be executed by Diskominfo after deletion request is approved.

---

### MODULE: Risks

#### List All Risks
```http
GET /api/risks
Authorization: Bearer {token}

Query Parameters:
- status (optional): string - Filter by status (pending|rejected|accepted)
- asset_id (optional): integer - Filter by asset

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "asset_id": 1,
      "judul": "Risiko Kerusakan Hardware",
      "deskripsi": "Potensi kerusakan pada komponen hardware",
      "penyebab": "Usia perangkat sudah tua",
      "dampak": "Gangguan operasional",
      "probabilitas": 3, // 1-5
      "nilai_dampak": 4, // 1-5
      "level_risiko": 12, // probabilitas × nilai_dampak
      "kriteria": "High", // Low | Medium | High
      "prioritas": "High", // Low | Medium | High
      "status": "pending", // pending | rejected | accepted
      "alasan_penolakan": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "asset": {
        "id": 1,
        "nama": "Laptop Dell"
      }
    }
  ]
}
```

#### Create Risk
```http
POST /api/risks
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "asset_id": 1,
  "judul": "Risiko Kerusakan Hardware",
  "deskripsi": "Potensi kerusakan pada komponen hardware",
  "penyebab": "Usia perangkat sudah tua",
  "dampak": "Gangguan operasional",
  "probabilitas": 3,
  "nilai_dampak": 4,
  "level_risiko": 12,
  "kriteria": "High",
  "prioritas": "High"
}

Response 201:
{
  "success": true,
  "message": "Risk berhasil dibuat",
  "data": { /* risk object */ }
}
```

#### Approve Risk
```http
POST /api/risks/{id}/approve
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Risk berhasil disetujui",
  "data": {
    "id": 1,
    "status": "accepted"
  }
}
```

#### Reject Risk
```http
POST /api/risks/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "alasan": "Analisis risiko kurang mendalam"
}

Response 200:
{
  "success": true,
  "message": "Risk berhasil ditolak",
  "data": {
    "id": 1,
    "status": "rejected",
    "alasan_penolakan": "Analisis risiko kurang mendalam"
  }
}
```

---

### MODULE: Risk Treatments

#### List All Risk Treatments
```http
GET /api/risk-treatments
Authorization: Bearer {token}

Query Parameters:
- status (optional): string - Filter by status (pending|accepted|rejected)
- risiko_id (optional): integer - Filter by risk

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "risiko_id": 1,
      "strategi": "Mitigate", // Avoid | Mitigate | Transfer | Accept
      "pengendalian": "Install antivirus dan firewall",
      "penanggung_jawab_id": 2,
      "target_tanggal": "2024-12-31",
      "biaya": 5000000,
      "probabilitas_akhir": 2,
      "dampak_akhir": 3,
      "level_residual": 6,
      "status": "pending",
      "alasan_penolakan": null,
      "created_at": "2024-01-01T00:00:00Z",
      "risk": {
        "id": 1,
        "judul": "Risiko Kerusakan Hardware"
      },
      "penanggungjawab": {
        "id": 2,
        "nama": "Jane Smith"
      }
    }
  ]
}
```

#### Create Risk Treatment
```http
POST /api/risk-treatments
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "risiko_id": 1,
  "strategi": "Mitigate",
  "pengendalian": "Install antivirus dan firewall",
  "penanggung_jawab_id": 2,
  "target_tanggal": "2024-12-31",
  "biaya": 5000000,
  "probabilitas_akhir": 2,
  "dampak_akhir": 3,
  "level_residual": 6
}

Response 201:
{
  "success": true,
  "message": "Risk treatment berhasil dibuat",
  "data": { /* risk treatment object */ }
}
```

#### Approve Risk Treatment
```http
POST /api/risk-treatments/{id}/approve
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Risk treatment berhasil disetujui"
}
```

#### Reject Risk Treatment
```http
POST /api/risk-treatments/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "alasan": "Strategi pengendalian kurang efektif"
}

Response 200:
{
  "success": true,
  "message": "Risk treatment berhasil ditolak"
}
```

---

### MODULE: Maintenances

#### List All Maintenances
```http
GET /api/maintenances
Authorization: Bearer {token}

Query Parameters:
- status_review (optional): string - Filter by status (pending|accepted|rejected)
- asset_id (optional): integer - Filter by asset

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "asset_id": 5,
      "risk_id": 2,
      "risk_treatment_id": 1,
      "alasan_pemeliharaan": "Preventive maintenance",
      "buktiLampiran": "maintenance_plan.pdf",
      "status_review": "pending",
      "alasan_penolakan": null,
      "created_at": "2024-12-01T10:00:00Z",
      "asset": {
        "id": 5,
        "nama": "Server HP ProLiant"
      }
    }
  ]
}
```

#### Create Maintenance
```http
POST /api/maintenances
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "asset_id": 5,
  "risk_id": 2,
  "risk_treatment_id": 1,
  "alasan_pemeliharaan": "Preventive maintenance",
  "buktiLampiran": "maintenance_plan.pdf",
  "status_review": "pending"
}

Response 201:
{
  "success": true,
  "message": "Maintenance berhasil dibuat",
  "data": { /* maintenance object */ }
}
```

#### Update Maintenance (For Verification)
```http
PUT /api/maintenances/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request (Approve):
{
  "status_review": "accepted"
}

Request (Reject):
{
  "status_review": "rejected",
  "alasan_penolakan": "Jadwal tidak sesuai"
}

Response 200:
{
  "success": true,
  "message": "Maintenance berhasil diupdate"
}
```

---

### MODULE: Asset Deletions

#### List All Asset Deletions
```http
GET /api/asset-deletions
Authorization: Bearer {token}

Query Parameters:
- status (optional): string - Filter by status (pending|accepted|rejected)

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "asset_id": 8,
      "alasan_penghapusan": "Asset sudah rusak total dan tidak dapat diperbaiki",
      "lampiran": "foto_kerusakan.pdf",
      "status": "pending",
      "alasan_penolakan": null,
      "created_at": "2024-11-15T09:00:00Z",
      "asset": {
        "id": 8,
        "nama": "Laptop HP Pavilion",
        "kondisi": "rusak-berat"
      }
    }
  ]
}
```

#### Create Asset Deletion Request
```http
POST /api/asset-deletions
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "asset_id": 8,
  "alasan_penghapusan": "Asset sudah rusak total",
  "lampiran": "foto_kerusakan.pdf",
  "status": "pending"
}

Response 201:
{
  "success": true,
  "message": "Asset deletion request berhasil dibuat",
  "data": { /* asset deletion object */ }
}
```

#### Review Asset Deletion (Verifikator)
```http
PUT /api/asset-deletions/{id}/review
Authorization: Bearer {token}
Content-Type: application/json

Request (Approve):
{
  "status": "accepted"
}

Request (Reject):
{
  "status": "rejected",
  "alasan": "Asset masih dapat diperbaiki"
}

Response 200:
{
  "success": true,
  "message": "Review asset deletion berhasil",
  "data": {
    "id": 1,
    "status": "accepted"
  }
}
```

**⚠️ Important:** After `status: "accepted"`, Diskominfo must call `DELETE /api/assets/{asset_id}` to actually delete the asset.

---

### MODULE: Supporting Data

#### Dinas
```http
GET /api/dinas
POST /api/dinas
GET /api/dinas/{id}
PUT /api/dinas/{id}
DELETE /api/dinas/{id}
```

#### Lokasi (Locations)
```http
GET /api/lokasis
POST /api/lokasis
GET /api/lokasis/{id}
PUT /api/lokasis/{id}
DELETE /api/lokasis/{id}
```

#### Penanggung Jawab (Person in Charge)
```http
GET /api/penanggungjawabs
POST /api/penanggungjawabs
GET /api/penanggungjawabs/{id}
PUT /api/penanggungjawabs/{id}
DELETE /api/penanggungjawabs/{id}
```

<<<<<<< HEAD
#### Kategori (Main Category)
```http
GET /api/kategoris
POST /api/kategoris
GET /api/kategoris/{id}
PUT /api/kategoris/{id}
DELETE /api/kategoris/{id}
```

=======
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c
#### Sub Kategori
```http
GET /api/sub-kategoris
POST /api/sub-kategoris
GET /api/sub-kategoris/{id}
PUT /api/sub-kategoris/{id}
DELETE /api/sub-kategoris/{id}

Query Parameters for GET:
- kategori_id (optional): integer - Filter by parent category
```

---

## 📊 Data Models

### Asset Status Flow
```
pending → [verifikator review] → diterima | ditolak
diterima → [maintenance request] → pemeliharaan
```

### Risk Status Flow
```
pending → [verifikator review] → accepted | rejected
```

### Risk Treatment Status Flow
```
pending → [verifikator review] → accepted | rejected
accepted → [can create maintenance request]
```

### Maintenance Status Flow
```
pending → [verifikator review] → accepted | rejected
```

### Asset Deletion Status Flow
```
pending → [verifikator review] → accepted | rejected
accepted → [diskominfo executes DELETE /api/assets/{id}]
```

---

<<<<<<< HEAD
## ✅ Additional Implemented Endpoints (Not in Original Requirements)

### 1. Unit Kerja Management
=======
## 🔴 Missing Endpoints (Not Yet Implemented)

### 1. Unit Kerja Management (Optional)
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c
```http
GET /api/unit-kerjas
POST /api/unit-kerjas
GET /api/unit-kerjas/{id}
PUT /api/unit-kerjas/{id}
DELETE /api/unit-kerjas/{id}
```

<<<<<<< HEAD
**Status:** ✅ Fully implemented
=======
**Status:** Backend API exists but no frontend implementation.
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c

**Data Structure:**
```json
{
  "id": 1,
  "name": "Bidang Pendidikan Dasar",
  "dinas_id": 1,
  "dinas": {
    "id": 1,
    "name": "Dinas Pendidikan"
  }
}
```

<<<<<<< HEAD
### 2. Kategori (Main Category) Management
=======
### 2. Kategori (Main Category)
No direct endpoint found. Currently derived from SubKategori relationships.

**Recommendation:** Add dedicated Kategori endpoints if direct category management is needed:
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c
```http
GET /api/kategoris
POST /api/kategoris
GET /api/kategoris/{id}
PUT /api/kategoris/{id}
DELETE /api/kategoris/{id}
```

<<<<<<< HEAD
**Status:** ✅ Fully implemented

**Data Structure:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nama": "Hardware",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "subKategori": [
      {
        "id": 1,
        "kategori_id": 1,
        "nama": "Laptop"
      }
    ]
  }
}
```

**Note:** Kategori cannot be deleted if it has related SubKategori records.

### 3. User Management by Dinas
```http
GET /api/users/by-dinas/{dinas_id}
```

**Status:** ✅ Implemented

**Use Case:** Get all users filtered by dinas for admin panels or role assignment.

### 4. Risk Rejection Tracking
```http
GET /api/risk-rejecteds
GET /api/risk-rejecteds/{id}
```

**Status:** ✅ Implemented (Read-only)

**Use Case:** Track rejection history for risk submissions.

### 5. Risk Treatment Rejection Tracking
```http
GET /api/risk-treatment-rejecteds
GET /api/risk-treatment-rejecteds/{id}
```

**Status:** ✅ Implemented (Read-only)

**Use Case:** Track rejection history for risk treatment submissions.

### 6. Dashboard Endpoints - Diskominfo & Auditor
```http
GET /api/dashboard/diskominfo
GET /api/dashboard/auditor
GET /api/dashboard/dinas/{dinas_id}
```

**Status:** ✅ Fully implemented (December 12, 2025)

**Diskominfo Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "assets": {
      "total": 150,
      "by_status": {
        "pending": 10,
        "diterima": 120,
        "ditolak": 5,
        "pemeliharaan": 15
      },
      "by_kondisi": {
        "baik": 100,
        "rusak_ringan": 30,
        "rusak_berat": 20
      },
      "by_usage": {
        "active": 130,
        "inactive": 20
      }
    },
    "risks": {
      "total": 45,
      "by_prioritas": {
        "Low": 20,
        "Medium": 15,
        "High": 10
      },
      "by_status": {
        "pending": 8,
        "accepted": 35,
        "rejected": 2
      }
    },
    "deletions": {
      "pending": 3,
      "accepted": 2,
      "rejected": 1,
      "awaiting_final_delete": 2
    },
    "maintenances": {
      "total": 30,
      "pending": 5,
      "accepted": 20,
      "rejected": 5
    },
    "total_nilai_aset": 5000000000
  }
}
```

**Auditor Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_dinas": 12,
      "total_assets": 150,
      "total_risks": 45,
      "total_maintenances": 30,
      "total_nilai_aset": 5000000000
    },
    "assets_by_dinas": [
      {
        "dinas_id": 1,
        "dinas_nama": "Dinas Pendidikan",
        "total_assets": 50,
        "total_nilai": 1500000000,
        "pending": 3,
        "diterima": 45,
        "pemeliharaan": 2
      }
    ],
    "risks_by_priority": {
      "Low": 20,
      "Medium": 15,
      "High": 10
    },
    "risks_by_dinas": [
      {
        "dinas_id": 1,
        "dinas_nama": "Dinas Pendidikan",
        "low": 8,
        "medium": 5,
        "high": 3
      }
    ],
    "risk_treatments_by_residual": {
      "low": {
        "range": "1-6",
        "total": 15
      },
      "medium": {
        "range": "7-14",
        "total": 20
      },
      "high": {
        "range": "15-25",
        "total": 10
      }
    },
    "maintenances_timeline": [
      {
        "month": "2024-06",
        "total": 5,
        "pending": 1,
        "accepted": 3,
        "rejected": 1
      }
    ],
    "recent_activities": [
      {
        "type": "asset",
        "action": "created",
        "dinas_nama": "Dinas Pendidikan",
        "description": "Laptop Dell Latitude",
        "timestamp": "2024-12-12T10:30:00Z"
      },
      {
        "type": "risk",
        "action": "approved",
        "dinas_nama": "Dinas Kesehatan",
        "description": "Risiko Keamanan Data",
        "timestamp": "2024-12-12T09:15:00Z"
      }
    ]
  }
}
```

**Per-Dinas Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "dinas": {
      "id": 1,
      "nama": "Dinas Pendidikan"
    },
    "assets": {
      "total": 50,
      "by_kategori": [
        {
          "kategori_id": 1,
          "kategori_nama": "Hardware",
          "total": 30
        }
      ],
      "by_status": {
        "pending": 3,
        "diterima": 45,
        "ditolak": 0,
        "pemeliharaan": 2
      },
      "total_nilai": 1500000000
    },
    "risks": {
      "total": 16,
      "by_prioritas": {
        "Low": 8,
        "Medium": 5,
        "High": 3
      }
    },
    "maintenances": {
      "total": 12,
      "pending": 2,
      "accepted": 8,
      "rejected": 2
    }
  }
}
```

### 7. Statistics Endpoints - Analytics & Trends
```http
GET /api/statistics/summary
GET /api/statistics/risk-heatmap
GET /api/statistics/trends?type={type}&period={period}&start_date={date}&end_date={date}
```

**Status:** ✅ Fully implemented (December 12, 2025)

**Summary Statistics Response:**
```json
{
  "success": true,
  "data": {
    "assets": {
      "total": 150,
      "pending_approval": 10,
      "in_maintenance": 15
    },
    "risks": {
      "total": 45,
      "high_priority": 10,
      "pending_approval": 8
    },
    "maintenances": {
      "total": 30,
      "pending_review": 5,
      "this_month": 8
    },
    "risk_treatments": {
      "total": 40,
      "high_residual": 10
    }
  }
}
```

**Risk Heatmap Response:**
```json
{
  "success": true,
  "data": {
    "heatmap": [
      {
        "probabilitas": 1,
        "dampak": 1,
        "level": 1,
        "category": "low",
        "count": 5
      },
      {
        "probabilitas": 5,
        "dampak": 5,
        "level": 25,
        "category": "high",
        "count": 3
      }
    ],
    "summary": {
      "low": 15,
      "medium": 20,
      "high": 10
    },
    "total": 45
  }
}
```

**Trends Response (with query parameters):**
```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "period": "2024-06",
        "total": 20,
        "diterima": 18,
        "pending": 2,
        "ditolak": 0
      }
    ],
    "risks": [
      {
        "period": "2024-06",
        "total": 8,
        "low": 3,
        "medium": 3,
        "high": 2
      }
    ],
    "maintenances": [
      {
        "period": "2024-06",
        "total": 5,
        "pending": 1,
        "accepted": 3,
        "rejected": 1
      }
    ]
  },
  "meta": {
    "type": "all",
    "period": "monthly",
    "start_date": "2023-12-12",
    "end_date": "2024-12-12"
  }
}
```

**Query Parameters:**
- `type`: `all` | `assets` | `risks` | `maintenances` (default: `all`)
- `period`: `daily` | `weekly` | `monthly` | `yearly` (default: `monthly`)
- `start_date`: YYYY-MM-DD format (default: 1 year ago)
- `end_date`: YYYY-MM-DD format (default: today)

**Performance Notes:**
- Dashboard endpoints: Target <500ms response time
- Statistics endpoints: Target <300ms response time
- Trends endpoint: Target <1s response time (depends on date range)
- Recommended: Implement caching for frequently accessed dashboard data

### 8. Original Statistics Endpoint (Still Available)
```http
GET /api/risk-treatment-rejecteds
GET /api/risk-treatment-rejecteds/{id}
```

**Status:** ✅ Implemented (Read-only)

**Use Case:** Track rejection history for risk treatment submissions.

### 6. Risk Treatment Statistics
```http
GET /api/risk-treatments/statistics/by-residual-level
```

**Status:** ✅ Implemented

**Response:**
```json
{
  "success": true,
  "data": {
    "Low (1-6)": 10,
    "Medium (7-14)": 25,
    "High (15-25)": 5
  }
}
```

**Use Case:** Dashboard aggregation for Auditor/Diskominfo roles.

### 7. SSO Integration
```http
GET /api/sso/callback
```

**Status:** ✅ Implemented

**Use Case:** Single Sign-On authentication callback (possibly for government systems).

=======
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c
---

## ⚠️ Frontend Integration Status

| Module | Dinas | Verifikator | Diskominfo | Auditor |
|--------|-------|-------------|------------|---------|
| Assets | ✅ Complete | ✅ Complete | ⚠️ Partial | ❌ No Integration |
| Risks | ✅ Complete | ✅ Complete | N/A | ❌ No Integration |
| Risk Treatments | ✅ Complete | ✅ Complete | N/A | ❌ No Integration |
| Maintenances | ✅ Complete | ✅ Complete | N/A | ❌ No Integration |
| Asset Deletions | ✅ Complete | ✅ Complete | ❌ No Integration | ❌ No Integration |
| Dashboard Stats | ✅ Complete | ✅ Complete | ❌ No Integration | ❌ No Integration |

---

## 🎯 Priority Action Items

### HIGH PRIORITY

<<<<<<< HEAD
1. **✅ Diskominfo Dashboard Implementation - COMPLETED**
   - Endpoint: `GET /api/dashboard/diskominfo` - System-wide statistics
   - Aggregates: Assets by status/kondisi/usage, Risks by priority/status
   - Includes: Total nilai aset, Deletion requests tracking, Maintenance stats

2. **✅ Auditor Dashboard Implementation - COMPLETED**
   - Endpoint: `GET /api/dashboard/auditor` - Comprehensive monitoring
   - Features: Assets by dinas with JOIN queries, Risks breakdown
   - Analytics: Maintenance timeline (6 months), Recent activities feed
   - Risk treatments by residual level distribution

3. **✅ Per-Dinas Dashboard Implementation - COMPLETED**
   - Endpoint: `GET /api/dashboard/dinas/{dinas_id}` - Dinas-specific stats
   - Aggregates: Assets by kategori/status, Risks by priority
   - Includes: Maintenance tracking, Total asset value per dinas

4. **✅ Statistics API Implementation - COMPLETED**
   - Endpoint: `GET /api/statistics/summary` - Quick dashboard widgets
   - Endpoint: `GET /api/statistics/risk-heatmap` - 5x5 probability×impact matrix
   - Endpoint: `GET /api/statistics/trends` - Historical timeline data
   - Query params: type, period (daily/weekly/monthly/yearly), date range
=======
1. **Diskominfo Dashboard Integration**
   - Endpoint: `GET /api/assets` with aggregation
   - Endpoint: `GET /api/risks` with grouping
   - Display total assets, risk levels, system overview

2. **Diskominfo Asset Deletion Workflow**
   - Page: `notifikasi-diskominfo.jsx`
   - Integrate: `GET /api/asset-deletions?status=accepted`
   - Integrate: `DELETE /api/assets/{id}` after approval

3. **Auditor Dashboard Complete Integration**
   - Aggregate data from all endpoints
   - Implement risk heatmap visualization
   - Per-dinas statistics breakdown
   - Maintenance schedule calendar
   - Chart implementations
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c

### MEDIUM PRIORITY

4. **Error Handling Improvements**
   - Add comprehensive error messages
   - Implement retry logic for failed requests
   - Add loading states for all async operations

5. **Performance Optimization**
   - Implement response caching where appropriate
   - Add pagination for large data sets
   - Optimize query parameters usage

### LOW PRIORITY

<<<<<<< HEAD
6. **Documentation Alignment**
   - ✅ Backend API: 100% Complete
   - ⚠️ Frontend: Update field names to match snake_case convention
   - ⚠️ Frontend: Integrate bonus endpoints (statistics, user filtering, rejection tracking)
=======
6. **Unit Kerja Management**
   - Add to `api.js` if needed
   - Create admin UI for management
   - Integrate with asset/user relationships
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c

---

## 📝 Notes for Backend Development

### Authentication
- All endpoints require Bearer token except `/api/login`
- Token should be validated using Laravel Sanctum
- Return 401 for unauthorized requests

### Response Format
All responses should follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

For errors:
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* validation errors if applicable */ }
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

### CORS Configuration
Ensure CORS is configured to accept requests from frontend domain.

### File Upload
Endpoints that accept files (lampiran_bukti, buktiLampiran) should support:
- Content-Type: `multipart/form-data`
- Max file size: TBD (recommend 10MB)
- Allowed formats: PDF, JPG, PNG

<<<<<<< HEAD
### Field Naming Notes
**Actual Implementation Uses snake_case:**
- ✅ Maintenance: `bukti_lampiran` (not `buktiLampiran`)
- ✅ Asset Deletion: `alasan_ditolak` (not `alasan_penolakan`)
- ✅ All database fields follow Laravel convention: snake_case

**Enhanced Status Tracking:**
- ✅ Maintenance has both `status_pemeliharaan` AND `status_review` for granular tracking
- ✅ When maintenance status is "penanganan", related asset status auto-updates to "pemeliharaan"

=======
>>>>>>> 94b12556fa8b0175b2e617b3c5ca2812e14c0d1c
---

## 🔗 Related Files

- Frontend API Client: `src/api.js`
- Context Management: `src/contexts/AssetContext.jsx`
- Environment Config: `.env` (VITE_URL_API)

---

**Last Updated:** December 12, 2025  
**Frontend Version:** React + Vite  
**Backend Expected:** Laravel with Sanctum Authentication
