# SIPRIMA Backend API

> **Sistem Informasi Prima (SIPRIMA)** - Asset and Risk Management System
> Backend API built with Laravel 12 & Sanctum Authentication

[![Laravel](https://img.shields.io/badge/Laravel-12.40.2-red.svg)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-blue.svg)](https://php.net)
[![API](https://img.shields.io/badge/API-100%25%20Complete-brightgreen.svg)](BACKEND_API_REQUIREMENTS.md)

## 🚀 About SIPRIMA

SIPRIMA is a comprehensive asset and risk management system designed for government agencies (Dinas). The system supports 4 main user roles:

- **Dinas User** - Submit assets, risks, and maintenance requests
- **Verifikator** - Review and approve/reject submissions
- **Diskominfo** - IT department oversight and final asset deletion approval
- **Auditor** - System-wide monitoring and reporting

## ✅ API Implementation Status

**100% Complete** - All 62 documented endpoints are implemented and functional.

### Core Modules
- ✅ Authentication (Login, Logout, User Info)
- ✅ Assets Management (Full CRUD + Status Workflow)
- ✅ Risk Management (Identification + Approval Workflow)
- ✅ Risk Treatment (Planning + Approval Workflow)
- ✅ Maintenance Requests (Full CRUD + Review)
- ✅ Asset Deletion Requests (Review Workflow)

### Supporting Data
- ✅ Dinas (Organizations)
- ✅ Unit Kerja (Work Units)
- ✅ Kategori (Categories) - **Newly Implemented**
- ✅ Sub Kategori (Sub-categories)
- ✅ Lokasi (Locations)
- ✅ Penanggungjawab (Persons in Charge)

### Bonus Features
- ✅ User Management by Dinas
- ✅ Risk Rejection Tracking
- ✅ Risk Treatment Rejection Tracking
- ✅ Risk Treatment Statistics
- ✅ SSO Integration

### Dashboard & Analytics - **NEW** 🎉
- ✅ Diskominfo Dashboard (System-wide statistics)
- ✅ Auditor Dashboard (Comprehensive monitoring)
- ✅ Per-Dinas Dashboard (Dinas-specific stats)
- ✅ Summary Statistics (Quick widgets)
- ✅ Risk Heatmap (5x5 probability×impact matrix)
- ✅ Trends Analytics (Historical timeline data)

## 📚 Documentation

See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) for complete API documentation including:
- All endpoint specifications
- Request/Response examples
- Authentication flow
- Status workflows
- Field naming conventions

## 🛠️ Technology Stack

- **Framework:** Laravel 12.40.2
- **Authentication:** Laravel Sanctum (Token-based)
- **Database:** MySQL/PostgreSQL
- **API Documentation:** L5-Swagger (OpenAPI)
- **PHP Version:** 8.2+

## 🚦 Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd api.siprima
```

2. **Install dependencies**
```bash
composer install
```

3. **Configure environment**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Run migrations**
```bash
php artisan migrate
```

5. **Seed database (optional)**
```bash
php artisan db:seed
```

6. **Start development server**
```bash
php artisan serve
```

The API will be available at `http://127.0.0.1:8000`

## 📋 Available Routes

```bash
# List all API routes
php artisan route:list --path=api

# List specific module routes
php artisan route:list --path=kategoris
php artisan route:list --path=assets
php artisan route:list --path=risks

# List dashboard & statistics routes
php artisan route:list --path=dashboard
php artisan route:list --path=statistics
```

## 🔑 Authentication

All API endpoints require Bearer token authentication except:
- `POST /api/login`
- `POST /api/register`
- `GET /api/sso/callback`

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://127.0.0.1:8000/api/assets
```

## 📊 Recent Updates (December 12, 2025)

### ✨ New Features
- **Kategori Management** - Full CRUD endpoints for category management
  - `GET /api/kategoris` - List all categories
  - `POST /api/kategoris` - Create new category
  - `GET /api/kategoris/{id}` - Get single category
  - `PUT /api/kategoris/{id}` - Update category
  - `DELETE /api/kategoris/{id}` - Delete category (if no sub-categories exist)

### 🔧 Improvements
- Complete API documentation update
- Field naming standardization (snake_case)
- Enhanced response structures
- 100% endpoint coverage achieved

## 📝 Notes

- All responses follow standardized format: `{ success: boolean, message?: string, data: object }`
- Database fields use `snake_case` convention
- Relationships are eager-loaded for optimal performance
- Comprehensive validation on all input

## 🆕 Recent Updates

**December 12, 2025 - Dashboard & Analytics Implementation:**
- ✅ Implemented DashboardController with 3 endpoints
  - `GET /api/dashboard/diskominfo` - System-wide statistics
  - `GET /api/dashboard/auditor` - Comprehensive monitoring with timeline
  - `GET /api/dashboard/dinas/{dinas_id}` - Per-dinas statistics
- ✅ Implemented StatisticsController with 3 endpoints
  - `GET /api/statistics/summary` - Quick dashboard widgets
  - `GET /api/statistics/risk-heatmap` - 5x5 probability×impact matrix
  - `GET /api/statistics/trends` - Historical timeline with query params
- ✅ Added complex aggregation queries with JOIN, GROUP BY, CASE WHEN
- ✅ Implemented recent activities feed and maintenance timeline (6 months)

**Earlier Updates:**
- ✅ Implemented Kategori CRUD module (December 12, 2025)
- ✅ Added delete constraint checking for Kategori
- ✅ Updated API implementation status to 100%

## 🤝 Contributing

This is a government project. For contributions or issues, please contact the development team.

---

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
# api.siprima
