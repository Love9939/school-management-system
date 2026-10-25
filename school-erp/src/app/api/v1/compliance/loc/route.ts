import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { studentName, className, attendancePercentage, rollNo } = await req.json();

    const attendance = parseFloat(attendancePercentage);

    if (isNaN(attendance)) {
      return NextResponse.json({ error: 'attendancePercentage must be a valid number' }, { status: 400 });
    }

    const isEligible = attendance >= 75.0;

    let verdict = 'PASS_LOC_READY';
    let condonationPetition = null;

    if (!isEligible) {
      if (attendance >= 60.0) {
        verdict = 'CONDITIONAL_CONDONATION_ALLOWED';
        condonationPetition = {
          petitionType: 'CBSE_RULE_13.2_MEDICAL_SHORTAGE',
          candidateName: studentName,
          rollNo: rollNo || 'PENDING',
          currentAttendance: `${attendance}%`,
          mandatoryThreshold: '75.0%',
          requiredDocuments: [
            'Form 13.2-A signed by School Principal',
            'Medical Fitness Certificate countersigned by District Civil Surgeon',
            'Hospitalization discharge summary',
            'Guardian undertaking on ₹100 non-judicial stamp paper',
          ],
          statutoryDeadline: '15th November 2025',
          destinationAuthority: 'Regional Officer, Central Board of Secondary Education (CBSE)',
        };
      } else {
        verdict = 'CRITICAL_DISQUALIFIED_BELOW_60_PERCENT';
      }
    }

    return NextResponse.json({
      status: 'success',
      candidateName: studentName,
      className,
      attendancePercentage: attendance,
      locEligibilityStatus: verdict,
      isApprovedForParikshaSangam: isEligible,
      condonationPetition,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error running LOC pre-check', details: error.message }, { status: 500 });
  }
}
