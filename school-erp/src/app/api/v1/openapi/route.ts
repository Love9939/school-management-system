import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Vidyoday CBSE K-12 Next-Gen Cloud ERP API',
      version: '1.0.0',
      description:
        'Official API specification for statutory CBSE compliance (UDISE+, APAAR, Board LOC), double-entry fee ledger with automated split settlement, biometric 7:30 AM auto-substitution, and NEP 2020 360° HPC.',
      contact: {
        name: 'Vidyoday ERP Architecture Team',
        email: 'api-support@vidyoday.edu.in',
      },
    },
    servers: [
      {
        url: 'http://localhost:3005/api/v1',
        description: 'Local Development Server',
      },
      {
        url: 'https://api.vidyoday.edu.in/v1',
        description: 'Production Cloud Gateway',
      },
    ],
    paths: {
      '/webhooks/payment': {
        post: {
          summary: 'Payment Gateway Webhook (WhatsApp 1-Tap UPI / NetBanking)',
          description:
            'Consumes asynchronous payment notifications from payment gateways (Razorpay, Cashfree, ICICI Eazypay). Automatically splits collections into Trust Account (82%) and Fleet Logistics Account (18%), writing an immutable double-entry journal voucher.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    event: { type: 'string', example: 'payment.captured' },
                    paymentId: { type: 'string', example: 'pay_98210398412' },
                    studentId: { type: 'string', example: 'std-103' },
                    admissionNo: { type: 'string', example: 'DPA-2019-0524' },
                    amountInPaisa: { type: 'integer', example: 3570000 },
                    method: { type: 'string', example: 'upi' },
                    bankRefNumber: { type: 'string', example: 'UPI/42890124810/HDFC' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Payment verified and split ledger journal voucher committed.',
            },
          },
        },
      },
      '/webhooks/biometric': {
        post: {
          summary: 'Biometric / Facial Recognition Device Hardware Punch Webhook',
          description:
            'Ingests real-time check-in logs from attendance devices (eSSL, Biomax, Scanix). At 07:45 AM cut-off, flags unannounced absences and automatically executes the optimal substitution solver respecting weekly burnout caps.',
          responses: {
            '200': {
              description: 'Punches recorded and substitutions dispatched to smartboards.',
            },
          },
        },
      },
      '/compliance/udise': {
        get: {
          summary: '1-Click UDISE+ SDMIS Export',
          description:
            'Returns verified Ministry of Education UDISE+ JSON payload containing Student SDMIS, Staff DCF, and Physical Infrastructure audits.',
          responses: {
            '200': {
              description: 'Standardized UDISE+ JSON payload.',
            },
          },
        },
      },
      '/compliance/loc': {
        post: {
          summary: 'Class 9-12 CBSE Board LOC Pre-Validation',
          description:
            'Validates students against CBSE Examination Bylaws (Rule 13.2 mandatory 75% attendance threshold) and generates Medical Condonation petitions for candidates between 60% and 74.9%.',
          responses: {
            '200': {
              description: 'LOC pre-validation results and condonation document package.',
            },
          },
        },
      },
      '/nep/voice-rubric': {
        post: {
          summary: 'AI Voice-to-Rubric Natural Language Transcription',
          description:
            'Parses spoken teacher voice notes and categorizes them into PARAKH 5 developmental domains, generating descriptive indicators and updating rubrics.',
          responses: {
            '200': {
              description: 'Categorized competency domain, score, and rubric indicators.',
            },
          },
        },
      },
      '/sync/offline-attendance': {
        post: {
          summary: 'Offline-First Attendance Sync (Flutter / SQLite / Drift)',
          description:
            'Syncs offline classroom attendance records marked in dead Wi-Fi zones with last-write-wins CRDT reconciliation and triggers WhatsApp parent absence notices.',
          responses: {
            '200': {
              description: 'Reconciliation summary and parent notification queue.',
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
