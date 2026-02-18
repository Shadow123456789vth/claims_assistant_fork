# FNOL Table Schema - Required Fields

## Overview
This document outlines all fields needed in the FNOL (First Notice of Loss) table to match the Claims Inventory display and functionality.

## Database Table Structure

### Table Name: `fnol_claims` or `x_dxcis_fnol_0_fnol`

---

## Core Fields

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `sys_id` | VARCHAR(32) | Yes | ServiceNow system ID (unique identifier) |
| `fnol_number` | VARCHAR(50) | Yes | FNOL number (e.g., FNOL-2024-001234) |
| `claim_number` | VARCHAR(50) | No | Claim number (if converted from FNOL) |
| `status` | VARCHAR(50) | Yes | Status: new, submitted, under_review, in_review, pending_requirements, requirements_complete, in_approval, approved, payment_scheduled, payment_complete, closed, denied, suspended |
| `type` | VARCHAR(50) | Yes | Claim type: death, maturity, surrender, withdrawal, disability |
| `source` | VARCHAR(50) | Yes | Source system: servicenow, demo, manual |
| `created_at` | DATETIME | Yes | Date/time claim was opened |
| `updated_at` | DATETIME | Yes | Date/time of last update |
| `created_by` | VARCHAR(100) | No | User who created the FNOL |
| `assigned_to` | VARCHAR(100) | No | Examiner/queue assigned to |

---

## Insured Person Information

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `insured_name` | VARCHAR(200) | Yes | Full name of insured person |
| `insured_ssn` | VARCHAR(11) | Yes | Social Security Number (###-##-####) |
| `insured_dob` | DATE | Yes | Date of birth |
| `insured_dod` | DATE | Yes* | Date of death (*for death claims) |
| `insured_age` | INT | No | Age at death/claim |
| `insured_gender` | VARCHAR(20) | No | Gender: Male, Female, Other |
| `insured_address` | TEXT | No | Full address |
| `insured_city` | VARCHAR(100) | No | City |
| `insured_state` | VARCHAR(2) | No | State (2-letter code) |
| `insured_zip` | VARCHAR(10) | No | ZIP code |

---

## Claimant Information

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `claimant_name` | VARCHAR(200) | Yes | Full name of claimant |
| `claimant_ssn` | VARCHAR(11) | No | Social Security Number |
| `claimant_dob` | DATE | No | Date of birth |
| `claimant_relationship` | VARCHAR(100) | No | Relationship to insured: Spouse, Child, Sibling, Parent, Other |
| `claimant_address` | TEXT | No | Full address |
| `claimant_city` | VARCHAR(100) | No | City |
| `claimant_state` | VARCHAR(2) | No | State |
| `claimant_zip` | VARCHAR(10) | No | ZIP code |
| `claimant_phone` | VARCHAR(20) | No | Phone number |
| `claimant_email` | VARCHAR(200) | No | Email address |

---

## Policy Information

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `policy_number` | VARCHAR(50) | Yes | Policy number |
| `policy_type` | VARCHAR(100) | Yes | Type: Term Life, Whole Life, Universal Life, Variable Universal Life, Annuity |
| `policy_coverage_amount` | DECIMAL(15,2) | Yes | Coverage/face amount |
| `policy_issue_date` | DATE | No | Policy issue date |
| `policy_effective_date` | DATE | No | Policy effective date |
| `policy_status` | VARCHAR(50) | No | Policy status: in-force, lapsed, suspended, terminated |

---

## Financial Information

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `claim_amount` | DECIMAL(15,2) | Yes | Total claim amount requested |
| `death_benefit` | DECIMAL(15,2) | No | Death benefit amount |
| `interest_amount` | DECIMAL(15,2) | No | Interest amount |
| `total_amount` | DECIMAL(15,2) | No | Total payout amount (benefit + interest) |
| `reserves_initial` | DECIMAL(15,2) | No | Initial reserve amount |
| `reserves_current` | DECIMAL(15,2) | No | Current reserve amount |
| `reserves_paid` | DECIMAL(15,2) | No | Amount paid from reserves |
| `reserves_outstanding` | DECIMAL(15,2) | No | Outstanding reserve amount |

---

## Workflow & Routing

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `routing_type` | VARCHAR(50) | No | Routing: fasttrack, standard, expedited, siu |
| `fso_case_number` | VARCHAR(50) | No | FSO case number |
| `priority` | VARCHAR(20) | No | Priority: high, medium, low |
| `current_task` | VARCHAR(200) | No | Current task name |
| `current_task_status` | VARCHAR(50) | No | Current task status |

---

## SLA Information

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `sla_due_date` | DATETIME | No | SLA due date |
| `sla_status` | VARCHAR(50) | No | SLA status: on_track, at_risk, overdue |
| `days_open` | INT | No | Number of days since opened |
| `days_to_sla` | INT | No | Days remaining until SLA breach |

---

## Additional Metadata

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `loss_date` | DATE | No | Date of loss/death |
| `loss_location` | TEXT | No | Location where loss occurred |
| `loss_description` | TEXT | No | Description of loss |
| `cause_of_death` | VARCHAR(200) | No | Cause of death (for death claims) |
| `notes` | TEXT | No | Additional notes |
| `tags` | TEXT | No | Comma-separated tags |

---

## JSON Fields (for complex data)

| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `beneficiaries` | JSON/TEXT | No | Array of beneficiary objects |
| `requirements` | JSON/TEXT | No | Array of requirement objects |
| `documents` | JSON/TEXT | No | Array of document references |
| `timeline` | JSON/TEXT | No | Array of timeline events |
| `ai_insights` | JSON/TEXT | No | AI analysis results |
| `bene_analyzer_data` | JSON/TEXT | No | Beneficiary analyzer results |

---

## Indexes (Recommended)

```sql
CREATE INDEX idx_fnol_number ON fnol_claims(fnol_number);
CREATE INDEX idx_status ON fnol_claims(status);
CREATE INDEX idx_policy_number ON fnol_claims(policy_number);
CREATE INDEX idx_insured_ssn ON fnol_claims(insured_ssn);
CREATE INDEX idx_created_at ON fnol_claims(created_at);
CREATE INDEX idx_routing_type ON fnol_claims(routing_type);
CREATE INDEX idx_sla_due_date ON fnol_claims(sla_due_date);
```

---

## Sample SQL CREATE TABLE Statement

```sql
CREATE TABLE fnol_claims (
    sys_id VARCHAR(32) PRIMARY KEY,
    fnol_number VARCHAR(50) NOT NULL UNIQUE,
    claim_number VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    type VARCHAR(50) NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'servicenow',

    -- Insured Information
    insured_name VARCHAR(200) NOT NULL,
    insured_ssn VARCHAR(11) NOT NULL,
    insured_dob DATE NOT NULL,
    insured_dod DATE,
    insured_age INT,
    insured_gender VARCHAR(20),
    insured_address TEXT,
    insured_city VARCHAR(100),
    insured_state VARCHAR(2),
    insured_zip VARCHAR(10),

    -- Claimant Information
    claimant_name VARCHAR(200) NOT NULL,
    claimant_ssn VARCHAR(11),
    claimant_dob DATE,
    claimant_relationship VARCHAR(100),
    claimant_address TEXT,
    claimant_city VARCHAR(100),
    claimant_state VARCHAR(2),
    claimant_zip VARCHAR(10),
    claimant_phone VARCHAR(20),
    claimant_email VARCHAR(200),

    -- Policy Information
    policy_number VARCHAR(50) NOT NULL,
    policy_type VARCHAR(100) NOT NULL,
    policy_coverage_amount DECIMAL(15,2) NOT NULL,
    policy_issue_date DATE,
    policy_effective_date DATE,
    policy_status VARCHAR(50),

    -- Financial Information
    claim_amount DECIMAL(15,2) NOT NULL,
    death_benefit DECIMAL(15,2),
    interest_amount DECIMAL(15,2),
    total_amount DECIMAL(15,2),
    reserves_initial DECIMAL(15,2),
    reserves_current DECIMAL(15,2),
    reserves_paid DECIMAL(15,2),
    reserves_outstanding DECIMAL(15,2),

    -- Workflow & Routing
    routing_type VARCHAR(50),
    fso_case_number VARCHAR(50),
    priority VARCHAR(20),
    current_task VARCHAR(200),
    current_task_status VARCHAR(50),
    assigned_to VARCHAR(100),

    -- SLA Information
    sla_due_date DATETIME,
    sla_status VARCHAR(50),
    days_open INT,
    days_to_sla INT,

    -- Additional Metadata
    loss_date DATE,
    loss_location TEXT,
    loss_description TEXT,
    cause_of_death VARCHAR(200),
    notes TEXT,
    tags TEXT,

    -- JSON Fields
    beneficiaries TEXT,
    requirements TEXT,
    documents TEXT,
    timeline TEXT,
    ai_insights TEXT,
    bene_analyzer_data TEXT,

    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);
```

---

## Sample Records (3 Examples for Reference)

### Record 1: Standard Death Claim - FastTrack Eligible

```json
{
  "sys_id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "fnol_number": "FNOL-2024-001234",
  "claim_number": "CLM-2024-001234",
  "status": "under_review",
  "type": "death",
  "source": "servicenow",

  // Insured Information
  "insured_name": "Robert Johnson",
  "insured_ssn": "456-78-9012",
  "insured_dob": "1955-03-15",
  "insured_dod": "2024-01-20",
  "insured_age": 68,
  "insured_gender": "Male",
  "insured_address": "1234 Oak Avenue",
  "insured_city": "Dallas",
  "insured_state": "TX",
  "insured_zip": "75201",

  // Claimant Information
  "claimant_name": "Mary Johnson",
  "claimant_ssn": "456-78-9013",
  "claimant_dob": "1958-07-22",
  "claimant_relationship": "Spouse",
  "claimant_address": "1234 Oak Avenue",
  "claimant_city": "Dallas",
  "claimant_state": "TX",
  "claimant_zip": "75201",
  "claimant_phone": "(214) 555-0123",
  "claimant_email": "mary.johnson@email.com",

  // Policy Information
  "policy_number": "POL2345678",
  "policy_type": "Term Life",
  "policy_coverage_amount": 500000.00,
  "policy_issue_date": "2010-05-15",
  "policy_effective_date": "2010-06-01",
  "policy_status": "in-force",

  // Financial Information
  "claim_amount": 500000.00,
  "death_benefit": 500000.00,
  "interest_amount": 10000.00,
  "total_amount": 510000.00,
  "reserves_initial": 475000.00,
  "reserves_current": 400000.00,
  "reserves_paid": 75000.00,
  "reserves_outstanding": 425000.00,

  // Workflow & Routing
  "routing_type": "fasttrack",
  "fso_case_number": "FSO-789456",
  "priority": "high",
  "current_task": "Review Documents",
  "current_task_status": "in_progress",
  "assigned_to": "Sarah Handler",

  // SLA Information
  "sla_due_date": "2024-02-15 17:00:00",
  "sla_status": "on_track",
  "days_open": 15,
  "days_to_sla": 10,

  // Additional Metadata
  "loss_date": "2024-01-20",
  "loss_location": "Dallas, TX",
  "loss_description": "Natural causes - passed away peacefully at home",
  "cause_of_death": "Heart Disease",
  "notes": "All required documents received. Awaiting medical examiner review.",
  "tags": "fasttrack,priority",

  // Timestamps
  "created_at": "2024-02-01 09:15:00",
  "updated_at": "2024-02-05 14:30:00",
  "created_by": "system"
}
```

---

### Record 2: Maturity Claim - Standard Processing

```json
{
  "sys_id": "q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "fnol_number": "FNOL-2024-002567",
  "claim_number": "",
  "status": "pending_requirements",
  "type": "maturity",
  "source": "servicenow",

  // Insured Information
  "insured_name": "Patricia Martinez",
  "insured_ssn": "234-56-7890",
  "insured_dob": "1950-11-08",
  "insured_dod": null,
  "insured_age": 73,
  "insured_gender": "Female",
  "insured_address": "5678 Elm Street, Apt 3B",
  "insured_city": "Chicago",
  "insured_state": "IL",
  "insured_zip": "60601",

  // Claimant Information (Same as Insured for Maturity)
  "claimant_name": "Patricia Martinez",
  "claimant_ssn": "234-56-7890",
  "claimant_dob": "1950-11-08",
  "claimant_relationship": "Self",
  "claimant_address": "5678 Elm Street, Apt 3B",
  "claimant_city": "Chicago",
  "claimant_state": "IL",
  "claimant_zip": "60601",
  "claimant_phone": "(312) 555-4567",
  "claimant_email": "patricia.martinez@email.com",

  // Policy Information
  "policy_number": "POL8765432",
  "policy_type": "Whole Life",
  "policy_coverage_amount": 250000.00,
  "policy_issue_date": "1995-11-08",
  "policy_effective_date": "1995-12-01",
  "policy_status": "in-force",

  // Financial Information
  "claim_amount": 265000.00,
  "death_benefit": 250000.00,
  "interest_amount": 15000.00,
  "total_amount": 265000.00,
  "reserves_initial": 237500.00,
  "reserves_current": 200000.00,
  "reserves_paid": 37500.00,
  "reserves_outstanding": 227500.00,

  // Workflow & Routing
  "routing_type": "standard",
  "fso_case_number": "FSO-654321",
  "priority": "medium",
  "current_task": "Awaiting Policy Documents",
  "current_task_status": "pending",
  "assigned_to": "Queue: Life Claims",

  // SLA Information
  "sla_due_date": "2024-02-28 17:00:00",
  "sla_status": "on_track",
  "days_open": 8,
  "days_to_sla": 18,

  // Additional Metadata
  "loss_date": "2024-01-15",
  "loss_location": "Chicago, IL",
  "loss_description": "Policy maturity date reached",
  "cause_of_death": null,
  "notes": "Waiting for original policy documents from insured.",
  "tags": "standard",

  // Timestamps
  "created_at": "2024-01-25 11:30:00",
  "updated_at": "2024-02-02 10:15:00",
  "created_by": "john.doe@bloom.com"
}
```

---

### Record 3: Death Claim - SIU Referral (High Value, Critical SLA)

```json
{
  "sys_id": "g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8",
  "fnol_number": "FNOL-2024-003891",
  "claim_number": "CLM-2024-003891",
  "status": "in_review",
  "type": "death",
  "source": "servicenow",

  // Insured Information
  "insured_name": "Michael Thompson",
  "insured_ssn": "789-01-2345",
  "insured_dob": "1972-09-30",
  "insured_dod": "2024-01-10",
  "insured_age": 51,
  "insured_gender": "Male",
  "insured_address": "9876 Pacific Coast Highway",
  "insured_city": "Los Angeles",
  "insured_state": "CA",
  "insured_zip": "90001",

  // Claimant Information
  "claimant_name": "Jennifer Thompson",
  "claimant_ssn": "789-01-2346",
  "claimant_dob": "1975-04-12",
  "claimant_relationship": "Spouse",
  "claimant_address": "9876 Pacific Coast Highway",
  "claimant_city": "Los Angeles",
  "claimant_state": "CA",
  "claimant_zip": "90001",
  "claimant_phone": "(310) 555-7890",
  "claimant_email": "jennifer.thompson@email.com",

  // Policy Information
  "policy_number": "POL5432109",
  "policy_type": "Universal Life",
  "policy_coverage_amount": 2000000.00,
  "policy_issue_date": "2018-03-20",
  "policy_effective_date": "2018-04-01",
  "policy_status": "in-force",

  // Financial Information
  "claim_amount": 2050000.00,
  "death_benefit": 2000000.00,
  "interest_amount": 50000.00,
  "total_amount": 2050000.00,
  "reserves_initial": 1900000.00,
  "reserves_current": 1700000.00,
  "reserves_paid": 200000.00,
  "reserves_outstanding": 1850000.00,

  // Workflow & Routing
  "routing_type": "siu",
  "fso_case_number": "FSO-999888",
  "priority": "high",
  "current_task": "SIU Investigation",
  "current_task_status": "in_progress",
  "assigned_to": "Mike Reviewer",

  // SLA Information
  "sla_due_date": "2024-02-10 17:00:00",
  "sla_status": "at_risk",
  "days_open": 22,
  "days_to_sla": 1,

  // Additional Metadata
  "loss_date": "2024-01-10",
  "loss_location": "Los Angeles, CA",
  "loss_description": "Death occurred within contestability period",
  "cause_of_death": "Accident",
  "notes": "Referred to SIU for investigation. Policy issued less than 2 years ago. High value claim requires additional review. Awaiting police report and autopsy results.",
  "tags": "siu-referral,high-value,review-needed",

  // Timestamps
  "created_at": "2024-01-15 08:00:00",
  "updated_at": "2024-02-05 16:45:00",
  "created_by": "system"
}
```

---

## Summary of Sample Records

| Field | Record 1 | Record 2 | Record 3 |
|-------|----------|----------|----------|
| **FNOL Number** | FNOL-2024-001234 | FNOL-2024-002567 | FNOL-2024-003891 |
| **Type** | Death | Maturity | Death |
| **Status** | under_review | pending_requirements | in_review |
| **Routing** | FastTrack | Standard | SIU |
| **Coverage** | $500,000 | $250,000 | $2,000,000 |
| **SLA Status** | On Track | On Track | At Risk |
| **Location** | Dallas, TX | Chicago, IL | Los Angeles, CA |
| **Priority** | High | Medium | High |

---

## Notes

1. **Required Fields**: Minimum fields needed for basic functionality
2. **Optional Fields**: Enhance functionality and provide better tracking
3. **JSON Fields**: Store complex nested data structures
4. **Indexes**: Improve query performance for common searches
5. **US Data**: Use US formats for SSN (###-##-####), phone numbers, addresses, and dates

---

**Last Updated**: 2026-02-18
