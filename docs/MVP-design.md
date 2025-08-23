<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrustFlow Dashboard - Liquid Glass</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            /* Primary Palette */
            --primary-blue: #007AFF;
            --accent-orange: #FF9500;
            --success-green: #34C759;
            --warning-red: #FF3B30;
            
            /* Glass System */
            --glass-bg: rgba(255, 255, 255, 0.08);
            --glass-border: rgba(255, 255, 255, 0.12);
            --glass-hover: rgba(255, 255, 255, 0.15);
            --glass-active: rgba(255, 255, 255, 0.2);
            
            /* Dark Theme Base */
            --bg-primary: #0A0E17;
            --bg-secondary: #141B2D;
            --bg-tertiary: #1E2A47;
            
            /* Typography */
            --text-primary: rgba(255, 255, 255, 0.95);
            --text-secondary: rgba(255, 255, 255, 0.7);
            --text-tertiary: rgba(255, 255, 255, 0.5);
            
            /* Shadows & Glows */
            --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.3);
            --shadow-elevated: 0 20px 60px rgba(0, 0, 0, 0.4);
            --glow-blue: 0 0 20px rgba(0, 122, 255, 0.3);
            --glow-orange: 0 0 20px rgba(255, 149, 0, 0.3);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, 
                var(--bg-primary) 0%, 
                var(--bg-secondary) 50%, 
                var(--bg-tertiary) 100%);
            color: var(--text-primary);
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* Dynamic Background Pattern */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(circle at 20% 20%, rgba(0, 122, 255, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 80% 60%, rgba(255, 149, 0, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 40% 80%, rgba(52, 199, 89, 0.06) 0%, transparent 40%);
            pointer-events: none;
            z-index: 0;
            animation: backgroundShift 20s ease-in-out infinite;
        }

        @keyframes backgroundShift {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.05) rotate(1deg); }
        }

        .dashboard-container {
            display: flex;
            min-height: 100vh;
            position: relative;
            z-index: 1;
        }

        /* Liquid Glass Sidebar */
        .sidebar {
            width: 280px;
            background: var(--glass-bg);
            backdrop-filter: blur(40px);
            border-right: 1px solid var(--glass-border);
            padding: 32px 24px;
            position: fixed;
            height: 100vh;
            z-index: 100;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .sidebar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, 
                rgba(0, 122, 255, 0.05) 0%, 
                transparent 30%, 
                rgba(255, 149, 0, 0.03) 100%);
            pointer-events: none;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 48px;
            position: relative;
            z-index: 1;
        }

        .brand-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-orange) 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: white;
            font-size: 18px;
            box-shadow: var(--glow-blue);
            transition: all 0.3s ease;
        }

        .brand-icon:hover {
            transform: scale(1.05);
            box-shadow: var(--glow-blue), var(--shadow-glass);
        }

        .brand-text {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.5px;
        }

        .nav-section {
            margin-bottom: 32px;
            position: relative;
            z-index: 1;
        }

        .nav-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-tertiary);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            padding: 0 16px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            margin-bottom: 8px;
            border-radius: 16px;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid transparent;
            position: relative;
            overflow: hidden;
        }

        .nav-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
                rgba(0, 122, 255, 0.1) 0%, 
                rgba(255, 149, 0, 0.1) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .nav-item:hover {
            background: var(--glass-hover);
            backdrop-filter: blur(20px);
            border-color: var(--glass-border);
            transform: translateY(-1px);
            color: var(--text-primary);
        }

        .nav-item:hover::before {
            opacity: 1;
        }

        .nav-item.active {
            background: rgba(0, 122, 255, 0.15);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(0, 122, 255, 0.3);
            color: var(--primary-blue);
            box-shadow: var(--glow-blue);
        }

        .nav-item.active::before {
            opacity: 0.5;
        }

        .nav-icon {
            font-size: 18px;
            width: 20px;
            text-align: center;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 280px;
            padding: 32px;
        }

        /* Liquid Glass Top Bar */
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding: 24px 32px;
            background: var(--glass-bg);
            backdrop-filter: blur(60px);
            border-radius: 24px;
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow-glass);
            position: relative;
            overflow: hidden;
        }

        .top-bar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(0, 122, 255, 0.5) 30%, 
                rgba(255, 149, 0, 0.5) 70%, 
                transparent 100%);
        }

        .welcome-section h1 {
            font-size: 28px;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 4px;
            letter-spacing: -1px;
        }

        .welcome-subtitle {
            font-size: 16px;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .top-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .search-box {
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            color: var(--text-primary);
            font-size: 14px;
            font-family: inherit;
            width: 280px;
            transition: all 0.3s ease;
        }

        .search-box:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--primary-blue);
            box-shadow: var(--glow-blue);
        }

        .user-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-orange) 0%, var(--primary-blue) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-glass);
        }

        .user-avatar:hover {
            transform: scale(1.05);
            box-shadow: var(--glow-orange), var(--shadow-elevated);
        }

        /* Trust Module */
        .trust-module {
            background: var(--glass-bg);
            backdrop-filter: blur(60px);
            border-radius: 24px;
            border: 1px solid var(--glass-border);
            padding: 32px;
            margin-bottom: 32px;
            box-shadow: var(--shadow-glass);
            position: relative;
            overflow: hidden;
            animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .trust-module::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, 
                rgba(52, 199, 89, 0.05) 0%, 
                rgba(0, 122, 255, 0.05) 50%, 
                rgba(255, 149, 0, 0.05) 100%);
            pointer-events: none;
        }

        .trust-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            position: relative;
            z-index: 1;
        }

        .trust-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.5px;
        }

        .trust-badge {
            padding: 8px 16px;
            background: rgba(52, 199, 89, 0.15);
            border: 1px solid rgba(52, 199, 89, 0.3);
            border-radius: 12px;
            color: var(--success-green);
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 0 20px rgba(52, 199, 89, 0.2);
        }

        .trust-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 32px;
            position: relative;
            z-index: 1;
        }

        .trust-stats {
            display: flex;
            gap: 24px;
        }

        .trust-stat {
            text-align: center;
        }

        .trust-stat-value {
            font-size: 32px;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 4px;
            letter-spacing: -1px;
        }

        .trust-stat-label {
            font-size: 14px;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .testimonial {
            text-align: right;
        }

        .testimonial-text {
            font-size: 16px;
            color: var(--text-secondary);
            font-style: italic;
            margin-bottom: 12px;
            line-height: 1.5;
        }

        .testimonial-author {
            font-size: 14px;
            color: var(--text-tertiary);
            font-weight: 600;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: var(--glass-bg);
            backdrop-filter: blur(60px);
            border-radius: 20px;
            border: 1px solid var(--glass-border);
            padding: 28px;
            box-shadow: var(--shadow-glass);
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                var(--accent-color, var(--primary-blue)) 50%, 
                transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-elevated);
            border-color: var(--glass-hover);
        }

        .stat-card:hover::before {
            opacity: 1;
        }

        .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .stat-label {
            font-size: 14px;
            color: var(--text-secondary);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            background: var(--accent-bg, rgba(0, 122, 255, 0.15));
            color: var(--accent-color, var(--primary-blue));
        }

        .stat-value {
            font-size: 36px;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 8px;
            letter-spacing: -1.5px;
        }

        .stat-change {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
        }

        .stat-change.positive {
            color: var(--success-green);
        }

        .stat-change.negative {
            color: var(--warning-red);
        }

        /* Action Cards */
        .action-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 32px;
            margin-bottom: 32px;
        }

        .action-card {
            background: var(--glass-bg);
            backdrop-filter: blur(60px);
            border-radius: 20px;
            border: 1px solid var(--glass-border);
            padding: 32px;
            box-shadow: var(--shadow-glass);
            position: relative;
            overflow: hidden;
        }

        .action-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 24px;
        }

        .action-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.5px;
        }

        .cta-button {
            padding: 14px 28px;
            background: linear-gradient(135deg, var(--accent-orange) 0%, var(--primary-blue) 100%);
            border: none;
            border-radius: 16px;
            color: white;
            font-weight: 600;
            font-size: 15px;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: var(--shadow-glass);
            position: relative;
            overflow: hidden;
        }

        .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: var(--glow-orange), var(--shadow-elevated);
        }

        .cta-button:hover::before {
            left: 100%;
        }

        /* Quick Actions */
        .quick-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .quick-action {
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            color: var(--text-secondary);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .quick-action:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            transform: translateY(-1px);
        }

        /* Data Visualization */
        .chart-container {
            height: 300px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-tertiary);
            font-size: 14px;
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        /* Responsive Design */
        @media (max-width: 1200px) {
            .action-grid {
                grid-template-columns: 1fr;
            }
            
            .trust-content {
                grid-template-columns: 1fr;
                gap: 24px;
            }
            
            .testimonial {
                text-align: left;
            }
        }

        @media (max-width: 1024px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .main-content {
                margin-left: 0;
            }
            
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }
        }

        @media (max-width: 768px) {
            .main-content {
                padding: 20px;
            }
            
            .top-bar {
                flex-direction: column;
                gap: 20px;
                padding: 20px;
            }
            
            .search-box {
                width: 100%;
            }
            
            .trust-stats {
                justify-content: space-between;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Liquid Glass Sidebar -->
        <div class="sidebar">
            <div class="brand">
                <div class="brand-icon">T</div>
                <div class="brand-text">TrustFlow</div>
            </div>
            
            <div class="nav-section">
                <div class="nav-title">Overview</div>
                <a href="#" class="nav-item active">
                    <span class="nav-icon">📊</span>
                    Dashboard
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">📈</span>
                    Analytics
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">👥</span>
                    Customers
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-title">Management</div>
                <a href="#" class="nav-item">
                    <span class="nav-icon">📅</span>
                    Bookings
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">💰</span>
                    Revenue
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">⚙️</span>
                    Settings
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-title">Support</div>
                <a href="#" class="nav-item">
                    <span class="nav-icon">💬</span>
                    Help Center
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">🔧</span>
                    API Docs
                </a>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Top Bar -->
            <div class="top-bar">
                <div class="welcome-section">
                    <h1>Welcome back, Sarah 👋</h1>
                    <div class="welcome-subtitle">Here's what's happening with your business today</div>
                </div>
                
                <div class="top-actions">
                    <input type="text" class="search-box" placeholder="🔍 Search customers, bookings...">
                    <div class="user-avatar">S</div>
                </div>
            </div>

            <!-- Trust Module -->
            <div class="trust-module">
                <div class="trust-header">
                    <h2 class="trust-title">Trusted by Industry Leaders</h2>
                    <div class="trust-badge">YC S23</div>
                </div>
                
                <div class="trust-content">
                    <div class="trust-stats">
                        <div class="trust-stat">
                            <div class="trust-stat-value">15K+</div>
                            <div class="trust-stat-label">Active Users</div>
                        </div>
                        <div class="trust-stat">
                            <div class="trust-stat-value">98.9%</div>
                            <div class="trust-stat-label">Uptime</div>
                        </div>
                        <div class="trust-stat">
                            <div class="trust-stat-value">$50M+</div>
                            <div class="trust-stat-label">Processed</div>
                        </div>
                    </div>
                    
                    <div class="testimonial">
                        <div class="testimonial-text">"TrustFlow transformed our booking system. Revenue increased 300% in just 6 months."</div>
                        <div class="testimonial-author">— Alex Chen, CEO of Wellness Co</div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card" style="--accent-color: #007AFF; --accent-bg: rgba(0, 122, 255, 0.15);">
                    <div class="stat-header">
                        <div class="stat-label">Total Revenue</div>
                        <div class="stat-icon">💰</div>
                    </div>
                    <div class="stat-value">$47,280</div>
                    <div class="stat-change positive">
                        <span>↗</span> +12.5% vs last month
                    </div>
                </div>

                <div class="stat-card" style="--accent-color: #FF9500; --accent-bg: rgba(255, 149, 0, 0.15);">
                    <div class="stat-header">
                        <div class="stat-label">Active Bookings</div>
                        <div class="stat-icon">📅</div>
                    </div>
                    <div class="stat-value">2,847</div>
                    <div class="stat-change positive">
                        <span>↗</span> +8.2% vs last week
                    </div>
                </div>

                <div class="stat-card" style="--accent-color: #34C759; --accent-bg: rgba(52, 199, 89, 0.15);">
                    <div class="stat-header">
                        <div class="stat-label">Customer Satisfaction</div>
                        <div class="stat-icon">⭐</div>
                    </div>
                    <div class="stat-value">4.9</div>
                    <div class="stat-change positive">
                        <span>↗</span> +0.3 vs last quarter
                    </div>
                </div>

                <div class="stat-card" style="--accent-color: #FF3B30; --accent-bg: rgba(255, 59, 48, 0.15);">
                    <div class="stat-header">
                        <div class="stat-label">Conversion Rate</div>
                        <div class="stat-icon">🎯</div>
                    </div>
                    <div class="stat-value">23.4%</div>
                    <div class="stat-change negative">
                        <span>↘</span> -2.1% vs last month
                    </div>
                </div>
            </div>

            <!-- Action Grid -->
            <div class="action-grid">
                <div class="action-card">
                    <div class="action-header">
                        <h3 class="action-title">Revenue Overview</h3>
                        <button class="cta-button">View Details</button>
                    </div>
                    
                    <div class="chart-container">
                        📊 Interactive Revenue Chart Coming Soon
                    </div>
                    
                    <div class="quick-actions">
                        <div class="quick-action">Export Data</div>
                        <div class="quick-action">Schedule Report</div>
                        <div class="quick-action">Share Insights</div>
                    </div>
                </div>

                <div class="action-card">
                    <div class="action-header">
                        <h3 class="action-title">Quick Actions</h3>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <button class="cta-button">New Booking</button>
                        <button class="cta-button">Send Reminders</button>
                        <button class="cta-button">Bulk Update</button>
                        <button class="cta-button">Export Reports</button>
                    </div>
                    
                    <div style="margin-top: 24px;">
                        <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">Recent Activity</div>
                        <div style="font-size: 13px; color: var(--text-