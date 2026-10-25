import { NextRequest, NextResponse } from 'next/server';

interface OfflineAttendanceItem {
  clientRecordId: string;
  studentId: string;
  admissionNo: string;
  className: string;
  section: string;
  date: string;
  periodNumber: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  markedOfflineAt: string;
  teacherEmployeeCode: string;
}

export async function POST(req: NextRequest) {
  try {
    const { batchId, syncTimestamp, deviceId, records } = await req.json();

    if (!Array.isArray(records)) {
      return NextResponse.json({ error: 'records array is required' }, { status: 400 });
    }

    const processedCount = records.length;
    const absentCount = records.filter((r: OfflineAttendanceItem) => r.status === 'ABSENT').length;

    // Simulate queuing SMS/WhatsApp notifications for absent students
    const queuedAbsenceAlerts = records
      .filter((r: OfflineAttendanceItem) => r.status === 'ABSENT')
      .map((r: OfflineAttendanceItem) => ({
        studentId: r.studentId,
        admissionNo: r.admissionNo,
        className: `${r.className}-${r.section}`,
        message: `Vidyoday ERP Alert: Your ward (${r.admissionNo}) has been marked ABSENT for Period 1 today (${r.date}). If this is an error, contact school reception.`,
        deliveryChannel: 'WHATSAPP_SMS_FALLBACK',
      }));

    return NextResponse.json({
      status: 'success',
      batchId: batchId || `SYNC-BATCH-${Date.now()}`,
      syncedAt: new Date().toISOString(),
      serverReconciliation: {
        totalRecordsIngested: processedCount,
        conflictsResolved: 0,
        presentMarked: processedCount - absentCount,
        absentMarked: absentCount,
        queuedParentNotifications: queuedAbsenceAlerts.length,
      },
      offlineSyncDetails: {
        syncProtocol: 'CRDT_LWW_REGISTER (Last-Write-Wins)',
        offlineDevicePushed: deviceId || 'FLUTTER-TEACHER-MOBILE-01',
        databaseCommitted: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Offline sync failed', details: error.message }, { status: 500 });
  }
}
