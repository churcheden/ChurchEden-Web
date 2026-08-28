import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { StatCards } from "./stat-cards";
import { GivingOverview } from "./giving-overview";
import { AttendanceTracker } from "./attendance-tracker";
import { QuickActions } from "./quick-actions";
import { RecentGiving } from "./recent-giving";
import { PendingApprovals } from "./pending-approvals";
import { UpcomingEvents } from "./upcoming-events";
import { FundBreakdown } from "./fund-breakdown";
import { AnnouncementsHub } from "./announcements";
import { MembersPage } from "./members";
import { EventsPage } from "./events";
import { AnnouncementsPage } from "./announcements-page";
import { TithesOfferingsPage } from "./tithes-offerings";
import { TransactionsPage } from "./transactions";
import { FinancialReportsPage } from "./financial-reports";
import { QRAttendancePage } from "./qr-attendance";
import { AttendanceHistoryPage } from "./attendance-history";
import { ChurchSettingsPage } from "./church-settings";
import { AdminManagementPage } from "./admin-management";

type Page = "Overview" | "Members" | string;

const DASHBOARD_PAGE_KEY = "ce_dashboard_page";

function readPersistedPage(): Page {
  const saved = sessionStorage.getItem(DASHBOARD_PAGE_KEY);
  if (saved) return saved;
  return "Overview";
}

function OverviewContent() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 lg:p-6 max-w-screen-2xl mx-auto">
        <StatCards />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <GivingOverview />
          <AttendanceTracker />
          <QuickActions />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <div className="xl:col-span-2"><RecentGiving /></div>
          <div><PendingApprovals /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 mt-4 lg:mt-5 pb-6">
          <UpcomingEvents />
          <FundBreakdown />
          <AnnouncementsHub />
        </div>
      </div>
    </main>
  );
}

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(readPersistedPage);

  // Persist the current dashboard page so a refresh keeps the user on it.
  useEffect(() => {
    sessionStorage.setItem(DASHBOARD_PAGE_KEY, currentPage);
  }, [currentPage]);

  const pageTitle: Record<string, string> = {
    Overview: "Church Overview",
    Members: "Members",
    Events: "Events",
    Announcements: "Announcements",
    "Tithes & Offerings": "Tithes & Offerings",
    "Financial Reports": "Financial Reports",
    Transactions: "Transactions",
    "QR Attendance": "QR Attendance",
    "Attendance History": "Attendance History",
    "Church Settings": "Church Settings",
    "Admin Management": "Admin Management",
  };

  return (
    <div className="flex overflow-hidden" style={{ height: "100dvh", background: "#F7F7F8" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitle[currentPage] ?? currentPage}
          breadcrumb={currentPage !== "Overview" ? currentPage : undefined}
        />

        {currentPage === "Overview" && <OverviewContent />}

        {currentPage === "Members" && (
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F5F4EF" }}>
            <MembersPage />
          </div>
        )}

        {currentPage === "Events" && (
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F5F4EF" }}>
            <EventsPage />
          </div>
        )}

        {currentPage === "Announcements" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <AnnouncementsPage />
          </div>
        )}

        {currentPage === "Tithes & Offerings" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <TithesOfferingsPage />
          </div>
        )}

        {currentPage === "Transactions" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <TransactionsPage />
          </div>
        )}

        {currentPage === "Financial Reports" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <FinancialReportsPage />
          </div>
        )}

        {currentPage === "QR Attendance" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <QRAttendancePage />
          </div>
        )}

        {currentPage === "Attendance History" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <AttendanceHistoryPage />
          </div>
        )}

        {currentPage === "Church Settings" && (
          <div className="flex-1 flex overflow-hidden">
            <ChurchSettingsPage />
          </div>
        )}

        {currentPage === "Admin Management" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminManagementPage />
          </div>
        )}

        {currentPage !== "Overview" && currentPage !== "Members" && currentPage !== "Events" && currentPage !== "Announcements" && currentPage !== "Tithes & Offerings" && currentPage !== "Transactions" && currentPage !== "Financial Reports" && currentPage !== "QR Attendance" && currentPage !== "Attendance History" && currentPage !== "Church Settings" && currentPage !== "Admin Management" && (
          <main className="flex-1 overflow-y-auto flex items-center justify-center" style={{ background: "#F5F4EF" }}>
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(200,134,10,0.08)" }}
              >
                <span style={{ fontSize: "24px" }}>🚧</span>
              </div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", fontFamily: "var(--font-label)" }}>
                {pageTitle[currentPage] ?? currentPage}
              </div>
              <div style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "4px" }}>
                This page is coming soon
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
