# SIPRIMA Backend API Requirements

> **Documentation for Backend Development**  
> This document outlines all API endpoint requirements for the SIPRIMA (Sistem Informasi Prima) frontend application.  
> Use this as a reference guide for implementing or verifying backend endpoints.

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

## 🔴 Missing Endpoints (Not Yet Implemented)

### 1. Unit Kerja Management (Optional)
```http
GET /api/unit-kerjas
POST /api/unit-kerjas
GET /api/unit-kerjas/{id}
PUT /api/unit-kerjas/{id}
DELETE /api/unit-kerjas/{id}
```

**Status:** Backend API exists but no frontend implementation.

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

### 2. Kategori (Main Category)
No direct endpoint found. Currently derived from SubKategori relationships.

**Recommendation:** Add dedicated Kategori endpoints if direct category management is needed:
```http
GET /api/kategoris
POST /api/kategoris
GET /api/kategoris/{id}
PUT /api/kategoris/{id}
DELETE /api/kategoris/{id}
```

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

6. **Unit Kerja Management**
   - Add to `api.js` if needed
   - Create admin UI for management
   - Integrate with asset/user relationships

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

---

## 🔗 Related Files

- Frontend API Client: `src/api.js`
- Context Management: `src/contexts/AssetContext.jsx`
- Environment Config: `.env` (VITE_URL_API)

---

**Last Updated:** December 12, 2025  
**Frontend Version:** React + Vite  
**Backend Expected:** Laravel with Sanctum Authentication
