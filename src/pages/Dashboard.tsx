import React, { useEffect, useState } from 'react';
import '../styles/page.css';
import Cards from '../components/Cards';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import PageContainer from '../components/PageContainer';
import { dietRequestsApi } from '../services/api';
import FormDateInput from '../components/Date';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface DietPlan {
  status: 'active' | 'completed';
}

interface Patient {
  id: string;
  name: string;
  dietPlans: DietPlan[];
  pendingApproval: boolean;
}

interface Stats {
  totalPatients: number;
  activeDietPlans: number;
  completedMeals: number;
  pendingApprovals: number;
}

interface DashboardProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    activeDietPlans: 0,
    completedMeals: 0,
    pendingApprovals: 0,
  });

  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Real-time approval status from dietRequestsApi
  const [approvalCounts, setApprovalCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  useEffect(() => {
    async function fetchApprovalStatus() {
      try {
        const requests = await dietRequestsApi.getAll();
        // Filter by date range if set
        const filtered = requests.filter((r: any) => {
          if (!r.date) return true;
          const d = new Date(r.date).toISOString().split('T')[0];
          if (fromDate && !toDate) {
            // Only fromDate selected: show only that day's data
            return d === fromDate;
          }
          if (fromDate && d < fromDate) return false;
          if (toDate && d > toDate) return false;
          return true;
        });
        let pending = 0, approved = 0, rejected = 0;
        filtered.forEach((r: any) => {
          if (r.approvalStatus === 'pending' || r.status === 'Pending') pending++;
          else if (r.approvalStatus === 'approved' || r.status === 'Diet Order Placed') approved++;
          else if (r.approvalStatus === 'rejected' || r.status === 'Rejected') rejected++;
        });
        setApprovalCounts({ pending, approved, rejected, total: filtered.length });
        setStats(s => ({
          ...s,
          totalPatients: filtered.length,
          pendingApprovals: pending,
        }));
      } catch (err) {
        setApprovalCounts({ pending: 0, approved: 0, rejected: 0, total: 0 });
      }
    }
    fetchApprovalStatus();
  }, [fromDate, toDate]);
  const totalPie = approvalCounts.pending + approvalCounts.approved + approvalCounts.rejected;
  const pieData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Patient Approval Status',
        data: [approvalCounts.pending, approvalCounts.approved, approvalCounts.rejected],
        backgroundColor: ['#FFCE56', '#4CAF50', '#FF6384'], // yellow, green, red
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: { size: 13, weight: 'normal' as const },
          color: '#333',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 12,
          boxHeight: 12,
          padding: 12,
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => ({
                text: label,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor?.[i] || '#fff',
                lineWidth: 1,
                hidden: false,
                pointStyle: 'circle',
                rotation: 0
              }));
            }
            return [];
          }
        }
      }, 
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw;
            const percent = totalPie ? ((value / totalPie) * 100).toFixed(1) : 0;
            return `${label}: ${percent}%`;
          },
        },
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e3eafc',
        borderWidth: 1,
        padding: 12,
        bodyFont: { size: 14, weight: 'bold' as const },
        titleFont: { size: 14, weight: 'bold' as const },
        displayColors: true,
        boxWidth: 18,
        boxHeight: 18,
        cornerRadius: 8,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 8,
        shadowColor: 'rgba(0,0,0,0.10)',
      },
    },
    cutout: '50%',
    borderRadius: 0,
    borderWidth: 0,
    layout: {
      padding: 15
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 300, // make the animation faster (default is 1000)
      easing: 'easeOutQuart' as const,
    },
  };

  // Bar graph: this month real-time, rest dummy
  const [barData, setBarData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'People on Diet Plan',
        data: [10, 15, 12, 18, 20, 22, 19, 25, 14, 17, 13, 16], // dummy for Sep-Dec
        backgroundColor: '#36A2EB',
        borderRadius: 6,
      },
    ],
  });

  useEffect(() => {
    async function fetchBarData() {
      try {
        const requests = await dietRequestsApi.getAll();
        const now = new Date();
        const thisYear = now.getFullYear();
        // Dummy values for Sep, Oct, Nov, Dec
        const dummy = { 8: 14, 9: 17, 10: 13, 11: 16 }; // 0-based: Sep=8, Oct=9, Nov=10, Dec=11
        // Count approved for each month
        const approvedByMonth: { [month: number]: number } = { ...dummy };
        requests.forEach((r: any) => {
          if ((r.approvalStatus === 'approved' || r.status === 'Diet Order Placed') && r.date) {
            const d = new Date(r.date);
            if (d.getFullYear() === thisYear) {
              const m = d.getMonth();
              approvedByMonth[m] = (approvedByMonth[m] || 0) + 1;
            }
          }
        });
        setBarData(prev => {
          const newData = [...prev.datasets[0].data];
          for (let m = 0; m < 12; m++) {
            if (approvedByMonth[m] !== undefined) newData[m] = approvedByMonth[m];
          }
          return {
            ...prev,
            datasets: [{ ...prev.datasets[0], data: newData }],
          };
        });
      } catch {}
    }
    fetchBarData();
  }, []);

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading
          title="Dashboard"
          subtitle="Overview of Diet Management System"
          className="dashboard-heading"
        />
        {/* Date filter row */}
        <div style={{
          background: '#f8fafc',
          padding: '18px 20px',
          borderRadius: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          marginBottom: 20,
          marginTop: 8,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{ minWidth: 140 }}>
            <FormDateInput
              label="From Date"
              name="fromDate"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          <div style={{ minWidth: 140 }}>
            <FormDateInput
              label="To Date"
              name="toDate"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="dashboard-summary-cards">
          <Cards title="Total Patients" subtitle={stats.totalPatients} />
          <Cards title="Approved Diet Plan" subtitle={approvalCounts.approved} />
          <Cards title="Pending Diet Plan" subtitle={approvalCounts.pending} />
          <Cards title="Rejected Diet Plan" subtitle={approvalCounts.rejected} />
          {/* <Cards title="Active Diet Plan" subtitle={stats.activeDietPlans} />
          <Cards title="Completed Meals" subtitle={stats.completedMeals} />
          <Cards title="Pending Approvals" subtitle={stats.pendingApprovals} /> */}
        </div>

        <div className="dashboard-charts-row">
          <div className="dashboard-chart dashboard-pie">
            <h3>Patient Approval Status</h3>
            {totalPie === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', fontWeight: 500, fontSize: 18, marginTop: 60 }}>
                No patients registered on this date.
              </div>
            ) : (
              <Pie data={pieData} options={pieOptions} />
            )}
          </div>
          <div className="dashboard-chart dashboard-bar">
            <h3>Diet Plan Usage (per month)</h3>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default Dashboard;

