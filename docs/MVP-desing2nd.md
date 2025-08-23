<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spamsense Bookings Command Center</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
            background: linear-gradient(135deg, 
                rgba(74, 144, 226, 0.1) 0%,
                rgba(80, 227, 194, 0.05) 25%,
                rgba(255, 107, 107, 0.05) 50%,
                rgba(142, 68, 173, 0.1) 100%);
            min-height: 100vh;
            overflow-x: hidden;
            backdrop-filter: blur(20px);
        }

        /* Signal Pattern Background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(circle at 20% 20%, rgba(74, 144, 226, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 60%, rgba(80, 227, 194, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255, 107, 107, 0.05) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }

        .dashboard-container {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Navigation */
        .sidebar {
            width: 280px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(40px);
            border-right: 1px solid rgba(255, 255, 255, 0.12);
            padding: 24px;
            position: fixed;
            height: 100vh;
            z-index: 100;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .sidebar-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 32px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .brand-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #4A90E2 0%, #50E3C2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: white;
            font-size: 16px;
        }

        .brand-text {
            font-size: 18px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
            letter-spacing: -0.5px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            margin-bottom: 8px;
            border-radius: 12px;
            color: rgba(0, 0, 0, 0.7);
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid transparent;
        }

        .nav-item:hover {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-color: rgba(255, 255, 255, 0.15);
            transform: translateY(-1px);
        }

        .nav-item.active {
            background: rgba(74, 144, 226, 0.15);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(74, 144, 226, 0.3);
            color: #4A90E2;
            box-shadow: 0 8px 32px rgba(74, 144, 226, 0.2);
        }

        .nav-icon {
            width: 20px;
            height: 20px;
            opacity: 0.8;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 280px;
            padding: 24px;
        }

        /* Top Bar */
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding: 20px 24px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(40px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .welcome-section {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
        }

        .location-filter {
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.8);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .location-filter:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-1px);
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .user-avatar:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        /* Dashboard Header */
        .dashboard-header {
            margin-bottom: 32px;
        }

        .dashboard-title {
            font-size: 32px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.9);
            margin-bottom: 16px;
            letter-spacing: -1px;
        }

        .date-controls {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
        }

        .date-nav {
            display: flex;
            gap: 8px;
        }

        .date-btn {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.7);
            transition: all 0.3s ease;
        }

        .date-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-1px);
        }

        .current-date {
            font-size: 18px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* Stats Bar */
        .stats-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }

        .stat-card {
            padding: 20px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(40px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, var(--accent-color, #4A90E2) 50%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .stat-card:hover::before {
            opacity: 1;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
        }

        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.9);
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
            font-weight: 500;
        }

        .stat-trend {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 8px;
            margin-top: 8px;
            display: inline-block;
        }

        .stat-trend.positive {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
        }

        .stat-trend.negative {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }

        /* Week View */
        .week-view {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 16px;
            margin-bottom: 32px;
        }

        .day-tile {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(40px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 16px;
            min-height: 400px;
            transition: all 0.3s ease;
            position: relative;
        }

        .day-tile:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
        }

        .day-header {
            text-align: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .day-name {
            font-size: 14px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.7);
            margin-bottom: 4px;
        }

        .day-date {
            font-size: 18px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.9);
        }

        .day-stats {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }

        .day-stat {
            flex: 1;
            text-align: center;
            padding: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .day-stat-value {
            font-size: 16px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
        }

        .day-stat-label {
            font-size: 10px;
            color: rgba(0, 0, 0, 0.6);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
        }

        /* Booking Cards */
        .booking-card {
            margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            overflow: hidden;
        }

        .booking-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: var(--booking-color, #4A90E2);
            opacity: 0.7;
        }

        .booking-card:hover {
            transform: translateY(-1px);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .booking-client {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .client-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4A90E2, #50E3C2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: 600;
        }

        .client-name {
            font-size: 13px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
        }

        .booking-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .booking-time {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.7);
            font-weight: 500;
        }

        .booking-status {
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-confirmed {
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
        }

        .status-pending {
            background: rgba(251, 191, 36, 0.15);
            color: #fbbf24;
        }

        .status-completed {
            background: rgba(59, 130, 246, 0.15);
            color: #3b82f6;
        }

        .booking-type {
            display: inline-block;
            padding: 2px 6px;
            background: rgba(255, 107, 107, 0.15);
            color: #ff6b6b;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 600;
            margin-top: 4px;
        }

        /* Filter Panel */
        .filter-panel {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }

        .filter-chip {
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.7);
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .filter-chip:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-1px);
        }

        .filter-chip.active {
            background: rgba(74, 144, 226, 0.15);
            border-color: rgba(74, 144, 226, 0.3);
            color: #4A90E2;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .main-content {
                margin-left: 0;
            }
            
            .week-view {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .week-view {
                grid-template-columns: 1fr;
            }
            
            .stats-bar {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .top-bar {
                flex-direction: column;
                gap: 16px;
            }
        }

        /* Animations */
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .booking-card,
        .day-tile,
        .stat-card {
            animation: slideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .booking-card:nth-child(1) { animation-delay: 0.1s; }
        .booking-card:nth-child(2) { animation-delay: 0.2s; }
        .booking-card:nth-child(3) { animation-delay: 0.3s; }
        .booking-card:nth-child(4) { animation-delay: 0.4s; }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar Navigation -->
        <div class="sidebar">
            <div class="sidebar-brand">
                <div class="brand-icon">S</div>
                <div class="brand-text">Spamsense</div>
            </div>
            
            <nav>
                <a href="#" class="nav-item">
                    <div class="nav-icon">👤</div>
                    Profile
                </a>
                <a href="#" class="nav-item">
                    <div class="nav-icon">🔗</div>
                    Referrals
                </a>
                <a href="#" class="nav-item">
                    <div class="nav-icon">🤖</div>
                    Maya
                </a>
                <a href="#" class="nav-item">
                    <div class="nav-icon">📊</div>
                    Dashboard
                </a>
                <a href="#" class="nav-item">
                    <div class="nav-icon">🎯</div>
                    Leads
                </a>
                <a href="#" class="nav-item">
                    <div class="nav-icon">📅</div>
                    Bookings
                </a>
                <a href="#" class="nav-item active">
                    <div class="nav-icon">⚡</div>
                    Manage Bookings
                </a>
                <a href="#" class="nav-item">
                    <div class="nav-icon">🏪</div>
                    Manage Storefront
                </a>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Top Bar -->
            <div class="top-bar">
                <div class="welcome-section">
                    <div class="welcome-text">Welcome, Sarah 👋</div>
                </div>
                <select class="location-filter">
                    <option>📍 Bay Area</option>
                    <option>📍 San Francisco</option>
                    <option>📍 Oakland</option>
                    <option>📍 San Jose</option>
                </select>
                <div class="user-avatar">S</div>
            </div>

            <!-- Dashboard Header -->
            <div class="dashboard-header">
                <h1 class="dashboard-title">Bookings Command Center</h1>
                
                <div class="date-controls">
                    <div class="date-nav">
                        <button class="date-btn" onclick="navigateWeek(-1)">‹</button>
                        <button class="date-btn" onclick="navigateWeek(1)">›</button>
                    </div>
                    <div class="current-date" id="currentWeek">Dec 16 - Dec 22, 2024</div>
                </div>

                <!-- Filter Panel -->
                <div class="filter-panel">
                    <div class="filter-chip active">All Services</div>
                    <div class="filter-chip">Massage</div>
                    <div class="filter-chip">Consultation</div>
                    <div class="filter-chip">Facial</div>
                    <div class="filter-chip">All Staff</div>
                    <div class="filter-chip">Sarah</div>
                    <div class="filter-chip">Mike</div>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="stats-bar">
                <div class="stat-card" style="--accent-color: #4A90E2;">
                    <div class="stat-value">42</div>
                    <div class="stat-label">Total Bookings</div>
                    <div class="stat-trend positive">↗ +12% vs last week</div>
                </div>
                <div class="stat-card" style="--accent-color: #22c55e;">
                    <div class="stat-value">38</div>
                    <div class="stat-label">Completed</div>
                    <div class="stat-trend positive">↗ 90.5% completion rate</div>
                </div>
                <div class="stat-card" style="--accent-color: #fbbf24;">
                    <div class="stat-value">4</div>
                    <div class="stat-label">Pending</div>
                    <div class="stat-trend negative">↘ 2 need follow-up</div>
                </div>
                <div class="stat-card" style="--accent-color: #50E3C2;">
                    <div class="stat-value">$3,240</div>
                    <div class="stat-label">Revenue</div>
                    <div class="stat-trend positive">↗ +$420 vs target</div>
                </div>
            </div>

            <!-- Week View -->
            <div class="week-view">
                <!-- Monday -->
                <div class="day-tile">
                    <div class="day-header">
                        <div class="day-name">Monday</div>
                        <div class="day-date">16</div>
                    </div>
                    <div class="day-stats">
                        <div class="day-stat">
                            <div class="day-stat-value">6</div>
                            <div class="day-stat-label">Bookings</div>
                        </div>
                        <div class="day-stat">
                            <div class="day-stat-value">$480</div>
                            <div class="day-stat-label">Revenue</div>
                        </div>
                    </div>
                    
                    <div class="booking-card" style="--booking-color: #FF6B6B;" onclick="selectBooking(this)">
                        <div class="booking-client">
                            <div class="client-avatar">JD</div>
                            <div class="client-name">John Doe</div>
                        </div>
                        <div class="booking-details">
                            <div class="booking-time">9:00 AM</div>
                            <div class="booking-status status-confirmed">Confirmed</div>
                        </div>
                        <div class="booking-type">Deep Tissue Massage</div>
                    </div>

                    <div class="booking-card" style="--booking-color: #4ECDC4;" onclick="selectBooking(this)">
                        <div class="booking-client">
                            <div class="client-avatar">AS</div>
                            <div class="client-name">Anna Smith</div>
                        </div>
                        <div class="booking-details">
                            <div class="booking-time">11:00 AM</div>
                            <div class="booking-status status-pending">Pending</div>
                        </div>
                        <div class="booking-type">Consultation</div>
                    </div>

                    <div class="booking-card" style="--booking-color: #A8E6CF;" onclick="selectBooking(this)">
                        <div class="booking-client">
                            <div class="client-avatar">MJ</div>
                            <div class="client-name">Mike Johnson</div>
                        </div>
                        <div class="booking-details">
                            <div class="booking-time">2:00 PM</div>
                            <div class="booking-status status-completed">Completed</div>
                        </div>
                        <div class="booking-type">Swedish Massage</div>
                    </div>
                </div>

                <!-- Tuesday -->
                <div class="day-tile">
                    <div class="day-header">
                        <div class="day-name">Tuesday</div>
                        <div class="day-date">17</div>
                    </div>
                    <div class="day-stats">
                        <div class="day-stat">
                            <div class="day-stat-value">8</div>
                            <div class="day-stat-label">Bookings</div>
                        </div>
                        <div class="day-stat">
                            <div class="day-stat-value">$640</div>
                            <div class="day-stat-label">Revenue</div>
                        </div>
                    </div>
                    
                    <div class="booking-card" style="--booking-color: #FFD93D;" onclick="selectBooking(this)">
                        <div class="booking-client">
                            <div class="client-avatar">EB</div>
                            <div class="client-name">Emily Brown</div>
                        </div>
                        <div class="booking-details">
                            <div class="booking-time">8:30 AM</div>
                            <div class="booking-status status-confirmed">Confirmed</div>
                        </div>
                        <div class="booking-type">Aromatherapy</div>
                    </div>

                    <div class="booking-card" style="--booking-color: #FF6B9D;" onclick="selectBooking(this)">
                        <div class="booking-client">
                            <div class="client-avatar">DW</div>
                            <div class="client-name">David Wilson</div>
                        </div>
                        <div class="booking-details">
                            <div class="booking-time">10:30 AM</div>
                            <div class="booking-status status-pending">Pending</div>
                        </div>
                        <div class="booking-type">Sports Massage</div>
                    </div>

                    <div class="booking-card" style="--booking-color: #6BCF7F;" onclick="selectBooking(this)">
                        <div class="booking-client">
                            <div class="client-avatar">LG</div>
                            <div class="client-name">Lisa Garcia</div>
                        </div>
                        <div class="booking-details">
                            <div class="booking-time">1:00 PM</div>
                            <div class="booking-status status-completed">Completed</div>
                        </div>
                        <div class="booking-type">Facial Treatment</div>
                    </div>
                </div>

                <!-- Wednesday -->
                <div class="day-tile">
                    <div class="day-header">
                        <div class="day-name">Wednesday</div>
                        <div class="day-date">18</div>
                    </div>
                    <div class="day-stats">
                        <div class="day-stat">
                            <div class="day-stat-value">5</div>
                            <div class="day-stat-label">Bookings</div>
                        </div>
                        <div class="day-stat">
                            <div class="day-stat-value">$375</div>
                            <div class="day-stat-label">Revenue</div>
                        </div>
                    </div>
                    
                    <div class="booking-card" style="--booking-color: #4A90E2;" onclick="selectBooking(this)">
                        <div class="booking-client">
                            <div class="client-avatar">RT</div>
                            <div class="client-name">Robert Taylor</div>
                        </div>