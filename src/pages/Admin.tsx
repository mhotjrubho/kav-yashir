import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Download, Loader2 } from "lucide-react";
import kavYasharLogo from "@/assets/kav-yashar-logo.png";

interface PersonalDetails {
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  ravKavNumber?: string;
  email?: string;
  [key: string]: unknown;
}

interface Complaint {
  id: string;
  reference_number: string;
  complaint_type: string;
  personal_details: PersonalDetails;
  complaint_details: Record<string, unknown> | null;
  attachments: string[] | null;
  status: string;
  created_at: string;
}

const complaintTypeHebrew: Record<string, string> = {
  no_ride: "נסיעה שלא בוצעה",
  no_stop: "אי עצירה בתחנה",
  delay: "איחור",
  early_departure: "יציאה מוקדמת",
  driver_behavior: "התנהגות נהג",
  add_line: "הוספת קו",
  overcrowding: "צפיפות",
  add_frequency: "הוספת תדירות",
  bus_condition: "מצב האוטובוס",
  license_violation: "ביצוע שאינו מתאים לרישיון",
  other: "אחר",
};

// Station-based complaint types
const stationBasedTypes = ["no_ride", "no_stop", "delay", "early_departure"];

// Component to handle signed URL generation for attachments
function AttachmentLink({ filePath }: { filePath: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    try {
      // Generate a signed URL (valid for 1 hour)
      const { data, error } = await supabase.storage
        .from('complaint-attachments')
        .createSignedUrl(filePath, 3600);

      if (error) {
        console.error('Error generating signed URL:', error);
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (err) {
      console.error('Error downloading file:', err);
    } finally {
      setLoading(false);
    }
  }, [filePath]);

  // Extract filename from path
  const fileName = filePath.split('/').pop() || 'file';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className="h-8 w-8 p-0"
      title={fileName}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (authLoading) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: hasRole } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (!hasRole) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await fetchComplaints();
    };

    checkAdminAndFetch();
  }, [authLoading, navigate]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComplaints((data || []).map((c) => ({
        ...c,
        personal_details: c.personal_details as PersonalDetails,
        complaint_details: c.complaint_details as Record<string, unknown> | null,
        attachments: c.attachments || null,
      })));
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      complaint.reference_number.toLowerCase().includes(searchLower) ||
      complaint.personal_details?.idNumber?.toLowerCase().includes(searchLower) ||
      complaint.personal_details?.firstName?.toLowerCase().includes(searchLower) ||
      complaint.personal_details?.lastName?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStationBasedDetails = (complaint: Complaint) => {
    if (!stationBasedTypes.includes(complaint.complaint_type)) {
      return null;
    }
    const details = complaint.complaint_details as Record<string, string> | null;
    return details;
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">טוען...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4" dir="rtl">
      <div className="container max-w-[1600px]">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={kavYasharLogo} alt="קו ישיר" className="h-12" />
            <h1 className="text-2xl font-bold text-foreground">ניהול תלונות</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowRight className="h-4 w-4 ml-2" />
            חזרה לטופס
          </Button>
        </header>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי מספר פנייה, ת.ז., שם..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right whitespace-nowrap">תאריך ושעת קבלה</TableHead>
                <TableHead className="text-right whitespace-nowrap">שם פרטי</TableHead>
                <TableHead className="text-right whitespace-nowrap">שם משפחה</TableHead>
                <TableHead className="text-right whitespace-nowrap">מספר זהות</TableHead>
                <TableHead className="text-right whitespace-nowrap">מספר רב-קו</TableHead>
                <TableHead className="text-right whitespace-nowrap">כתובת מייל</TableHead>
                <TableHead className="text-right whitespace-nowrap">סוג תלונה</TableHead>
                <TableHead className="text-right whitespace-nowrap">מספר תחנה</TableHead>
                <TableHead className="text-right whitespace-nowrap">שם תחנה</TableHead>
                <TableHead className="text-right whitespace-nowrap">עיר תחנה</TableHead>
                <TableHead className="text-right whitespace-nowrap">מספר קו</TableHead>
                <TableHead className="text-right whitespace-nowrap">חברת קו</TableHead>
                <TableHead className="text-right whitespace-nowrap">תאריך</TableHead>
                <TableHead className="text-right whitespace-nowrap">שעת הגעה לתחנה</TableHead>
                <TableHead className="text-right whitespace-nowrap">שעת עזיבה תחנה</TableHead>
                <TableHead className="text-right whitespace-nowrap">תיאור המקרה</TableHead>
                <TableHead className="text-right whitespace-nowrap">קבצים מצורפים</TableHead>
                <TableHead className="text-right whitespace-nowrap">קוד פניה</TableHead>
                <TableHead className="text-right whitespace-nowrap">סטטוס</TableHead>
                <TableHead className="text-right whitespace-nowrap">קבצי תגובה ממשרד התחבורה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={20} className="text-center py-8 text-muted-foreground">
                    לא נמצאו תלונות
                  </TableCell>
                </TableRow>
              ) : (
                filteredComplaints.map((complaint) => {
                  const stationDetails = getStationBasedDetails(complaint);
                  const isStationBased = stationBasedTypes.includes(complaint.complaint_type);
                  const details = complaint.complaint_details as Record<string, string> | null;

                  return (
                    <TableRow key={complaint.id}>
                      {/* 1. תאריך ושעת קבלה */}
                      <TableCell className="whitespace-nowrap">
                        {formatDate(complaint.created_at)}
                      </TableCell>
                      {/* 2. שם פרטי */}
                      <TableCell>{complaint.personal_details?.firstName || "-"}</TableCell>
                      {/* 3. שם משפחה */}
                      <TableCell>{complaint.personal_details?.lastName || "-"}</TableCell>
                      {/* 4. מספר זהות */}
                      <TableCell>{complaint.personal_details?.idNumber || "-"}</TableCell>
                      {/* 5. מספר רב-קו */}
                      <TableCell>{complaint.personal_details?.ravKavNumber || "-"}</TableCell>
                      {/* 6. כתובת מייל */}
                      <TableCell>{complaint.personal_details?.email || "-"}</TableCell>
                      {/* 7. סוג תלונה */}
                      <TableCell className="whitespace-nowrap">
                        {complaintTypeHebrew[complaint.complaint_type] || complaint.complaint_type}
                      </TableCell>
                      {/* 8-15: Station-based fields */}
                      {isStationBased ? (
                        <>
                          <TableCell>{stationDetails?.stationNumber || "-"}</TableCell>
                          <TableCell>{stationDetails?.stationName || "-"}</TableCell>
                          <TableCell>{stationDetails?.stationCity || "-"}</TableCell>
                          <TableCell>{stationDetails?.lineNumber || "-"}</TableCell>
                          <TableCell>{stationDetails?.operator || "-"}</TableCell>
                          <TableCell>{stationDetails?.eventDate || "-"}</TableCell>
                          <TableCell>{stationDetails?.arrivalTime || "-"}</TableCell>
                          <TableCell>{stationDetails?.departureTime || "-"}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={stationDetails?.description || ""}>
                            {stationDetails?.description || "-"}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>{details?.lineNumber || "-"}</TableCell>
                          <TableCell>{details?.operator || "-"}</TableCell>
                          <TableCell>{details?.eventDate || "-"}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={details?.description || ""}>
                            {details?.description || "-"}
                          </TableCell>
                        </>
                      )}
                      {/* 16. קבצים מצורפים */}
                      <TableCell>
                        {complaint.attachments && complaint.attachments.length > 0 ? (
                          <div className="flex gap-1">
                            {complaint.attachments.map((filePath, idx) => (
                              <AttachmentLink key={idx} filePath={filePath} />
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      {/* 17. קוד פניה */}
                      <TableCell className="font-mono text-sm">
                        {complaint.reference_number}
                      </TableCell>
                      {/* 18. סטטוס */}
                      <TableCell>{/* ריק - יתווסף בהמשך */}</TableCell>
                      {/* 19. קבצי תגובה */}
                      <TableCell>{/* ריק - יתווסף בהמשך */}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
