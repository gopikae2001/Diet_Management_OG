import React, { useEffect, useState } from 'react';
import '../styles/page.css';
import Cards from '../components/Cards';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import PageContainer from '../components/PageContainer';

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

  useEffect(() => {
    // Simulate fetching diet management data
    const patients: Patient[] = [
      {
        id: 'P001',
        name: 'John',
        dietPlans: [{ status: 'active' }, { status: 'completed' }],
        pendingApproval: false,
      },
      {
        id: 'P002',
        name: 'Jane',
        dietPlans: [{ status: 'completed' }],
        pendingApproval: true,
      },
      {
        id: 'P003',
        name: 'Alice',
        dietPlans: [{ status: 'active' }],
        pendingApproval: true,
      },
    ];

    const totalPatients = patients.length;
    const allPlans = patients.flatMap((p) => p.dietPlans);
    const activeDietPlans = allPlans.filter((p) => p.status === 'active').length;
    const completedMeals = allPlans.filter((p) => p.status === 'completed').length;
    const pendingApprovals = patients.filter((p) => p.pendingApproval).length;

    setStats({
      totalPatients,
      activeDietPlans,
      completedMeals,
      pendingApprovals,
    });
  }, []);

  const pieData = {
    labels: ['Low Carb', 'High Protein', 'Vegan', 'Diabetic', 'Renal', 'Others'],
    datasets: [
      {
        label: 'Diet Categories',
        data: [20, 15, 10, 25, 18, 12],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        borderWidth: 1,
      },
    ],
  };

  const totalPie = pieData.datasets[0].data.reduce((a, b) => a + b, 0);

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
    },
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'People on Diet Plan',
        data: [10, 15, 12, 18, 20, 22, 19, 25],
        backgroundColor: '#36A2EB',
        borderRadius: 6,
      },
    ],
  };

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading
          title="Dashboard"
          subtitle="Overview of Diet Management System"
          className="dashboard-heading"
        />
        <div className="dashboard-summary-cards">
          {[
            { title: 'Total Patients', subtitle: stats.totalPatients },
            { title: 'Active Diet Plan', subtitle: stats.activeDietPlans },
            { title: 'Completed Meals', subtitle: stats.completedMeals },
            { title: 'Pending Approvals', subtitle: stats.pendingApprovals },
          ].map((card, index) => (
            <Cards key={index} title={card.title} subtitle={card.subtitle} />
          ))}
        </div>

        <div className="dashboard-charts-row">
          <div className="dashboard-chart dashboard-pie">
            <h3>Diet Categories</h3>
            <Pie data={pieData} options={pieOptions} />
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

