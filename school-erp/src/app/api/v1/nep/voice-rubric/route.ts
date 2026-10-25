import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { transcript, studentId, studentName, stage } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'transcript string is required' }, { status: 400 });
    }

    const lower = transcript.toLowerCase();

    let matchedDomain = 'Cognitive & Mathematical Inquiry';
    let suggestedScore = 3;
    let rubricLevel = 'Proficient (L3)';
    let descriptors: string[] = [];

    if (lower.includes('empathy') || lower.includes('peer') || lower.includes('helped') || lower.includes('conflict') || lower.includes('kind')) {
      matchedDomain = 'Socio-Emotional & Ethical Development';
      suggestedScore = 4;
      rubricLevel = 'Exemplary (L4)';
      descriptors = [
        'Consistently shows active empathy and peer mediation skills',
        'Demonstrates collaborative spirit during cooperative group projects',
        'Respects classroom diversity and emotional well-being',
      ];
    } else if (lower.includes('paint') || lower.includes('draw') || lower.includes('music') || lower.includes('rhythm') || lower.includes('art')) {
      matchedDomain = 'Aesthetic & Cultural Expression';
      suggestedScore = 4;
      rubricLevel = 'Exemplary (L4)';
      descriptors = [
        'Expresses rich creative sensitivity through fine arts and music',
        'Integrates cultural folklore elements into design work',
      ];
    } else if (lower.includes('sports') || lower.includes('yoga') || lower.includes('running') || lower.includes('agility') || lower.includes('motor')) {
      matchedDomain = 'Physical & Motor Development';
      suggestedScore = 4;
      rubricLevel = 'Exemplary (L4)';
      descriptors = [
        'Exhibits outstanding neuromuscular coordination and stamina',
        'Active participant in track events and mindful breathing exercises',
      ];
    } else if (lower.includes('read') || lower.includes('story') || lower.includes('speech') || lower.includes('vocabulary') || lower.includes('language')) {
      matchedDomain = 'Language, Literacy & Communication';
      suggestedScore = 4;
      rubricLevel = 'Exemplary (L4)';
      descriptors = [
        'Articulates complex narrative thoughts with expressive intonation',
        'Demonstrates rich multilingual vocabulary in both English and Hindi',
      ];
    } else {
      // Default to Cognitive
      matchedDomain = 'Cognitive & Mathematical Inquiry';
      suggestedScore = 4;
      rubricLevel = 'Exemplary (L4)';
      descriptors = [
        'Demonstrates analytical problem solving in hands-on STEM experiments',
        'Formulates inquisitive scientific hypotheses independently',
        'Understands mathematical patterns and spatial estimation',
      ];
    }

    return NextResponse.json({
      status: 'success',
      inputTranscript: transcript,
      studentName: studentName || 'Aarav Sharma',
      parsedResult: {
        primaryDomain: matchedDomain,
        suggestedScore,
        rubricLevel,
        descriptors,
        formalTeacherNarrative: `Observation Notes: ${transcript}. Demonstrates strong competency alignment with CBSE PARAKH benchmarks.`,
        ncrfCreditContribution: '2.5 Credits logged to Academic Bank of Credits (ABC)',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error processing voice note', details: error.message }, { status: 500 });
  }
}
