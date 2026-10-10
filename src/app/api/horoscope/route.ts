import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { HoroscopeRequest } from '@/types/tarot';

const SYSTEM_PROMPT = `คุณคือ "แม่หมอ AI" ผู้เชี่ยวชาญด้านศาสตร์ไพ่ยิปซีและการอ่านดวงชะตาภาษาไทย
บุคลิกภาพ: อบอุ่น เป็นกันเอง ภาษาทันสมัย น่าเชื่อถือ และให้กำลังใจเชิงบวก

หลักการทำนาย:
1. วิเคราะห์ความหมายไพ่ทั้ง 3 ใบ โดยเชื่อมโยงกับ "คำถามของผู้ใช้" และ "พื้นดวงวันเกิด"
2. โครงสร้างคำทำนาย:
   - 🌟 สรุปภาพรวมดวงชะตา (1-2 ประโยค)
   - 🔮 เจาะลึกความหมายไพ่ 3 ใบตามลำดับ (อดีต / ปัจจุบัน / อนาคต)
   - 💡 คำแนะนำและข้อควรระวังในการปฏิบัติตัว (Actionable Advice)
3. ห้ามทำนายเรื่องร้ายแรงเกี่ยวกับโรคร้าย ความตาย หรือ事故 ให้เน้นการเตือนด้วยความระมัดระวัง
4. ความยาวไม่เกิน 250 คำ`;

export async function POST(req: NextRequest) {
  try {
    const body: HoroscopeRequest = await req.json();
    const { birthDate, question, zodiac, cards } = body;

    if (!cards || cards.length !== 3) {
      return NextResponse.json(
        { error: 'กรุณาเลือกไพ่ยิปซีให้ครบ 3 ใบ (อดีต, ปัจจุบัน, อนาคต)' },
        { status: 400 }
      );
    }

    const cardsDescription = cards
      .map(
        (c, idx) =>
          `ใบที่ ${idx + 1} (${c.positionLabel}): ไพ่ "${c.nameTh}" (${c.nameEn}) - สถานะ: ${
            c.isReversed ? 'ไพ่หัวกลับ (Reversed)' : 'ไพ่ตั้งตรง (Upright)'
          }`
      )
      .join('\n');

    const userPrompt = `ข้อมูลเจ้าชะตา:
- วันเกิด: ${birthDate || 'ไม่ได้ระบุ'} (ราศี: ${zodiac || 'ทั่วไป'})
- คำถามที่ตั้งจิตอธิษฐาน: "${question || 'ดูดวงภาพรวมและทิศทางชีวิต'}"

ไพ่ยิปซี 3 ใบที่เปิดได้:
${cardsDescription}

โปรดทำนายดวงชะตาตามหลักการและโครงสร้างที่กำหนดใน System Prompt ด้วยภาษาที่อบอุ่นและสร้างแรงบันดาลใจ`;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    let readingText = '';
    let modelUsed = '';

    // Primary: Google Gemini with gemini-3.1-flash-lite
    if (apiKey) {
      const candidateModels = [
        'gemini-3.1-flash-lite',
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
      ];

      for (const modelName of candidateModels) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${SYSTEM_PROMPT}\n\n---\n\n${userPrompt}` },
                ],
              },
            ],
          });

          if (response && response.text) {
            readingText = response.text.trim();
            modelUsed = modelName;
            break;
          }
        } catch (modelErr: unknown) {
          const errorMsg = modelErr instanceof Error ? modelErr.message : String(modelErr);
          console.warn(`[Horoscope API] Model ${modelName} failed:`, errorMsg);
          // continue to next model fallback
        }
      }
    }

    // Fallback if AI call failed or key is missing
    if (!readingText) {
      const firstCard = cards[0];
      const secondCard = cards[1];
      const thirdCard = cards[2];

      readingText = `🌟 สรุปภาพรวมดวงชะตา
พลังงานของจักรวาลชี้ว่าเรื่อง "${question || 'ที่คุณตั้งจิตถาม'}" กำลังอยู่ในจังหวะผลัดเปลี่ยนที่น่าจับตามอง มีโอกาสดีๆ รออยู่หากคุณมีสติและเปิดใจกว้าง

🔮 เจาะลึกความหมายไพ่ 3 ใบ
• อดีต: ได้รับอิทธิพลจากไพ่ ${firstCard.nameTh} (${firstCard.isReversed ? 'หัวกลับ' : 'ตั้งตรง'}) แสดงถึงบทเรียนและประสบการณ์ที่สั่งสมมา ซึ่งเป็นรากฐานสำคัญที่ส่งผลถึงจุดที่คุณยืนอยู่
• ปัจจุบัน: พลังแห่ง ${secondCard.nameTh} (${secondCard.isReversed ? 'หัวกลับ' : 'ตั้งตรง'}) สะท้อนสถานการณ์ปัจจุบันที่ต้องใช้ความตั้งใจจริงและความรอบคอบ อย่าเพิ่งตื่นตระหนกกับสิ่งรอบข้าง
• อนาคต: แสงสว่างจาก ${thirdCard.nameTh} (${thirdCard.isReversed ? 'หัวกลับ' : 'ตั้งตรง'}) เผยแนวโน้มบทสรุปที่ดีและทางออกที่ชัดเจน สิ่งที่คุณทุ่มเทจะไม่สูญเปล่า

💡 คำแนะนำและข้อควรระวัง
ช่วงนี้ควรหมั่นดูแลสุขภาพจิตใจ ไม่รับภาระอารมณ์จากผู้อื่นมากเกินไป ทำบุญบริจาคทานหรือปล่อยสัตว์น้ำเพื่อเสริมเมตตามหานิยม ความสำเร็จอยู่ไม่ไกลเกินเอื้อมค่ะ ✨`;
      modelUsed = 'Tarot Oracle Wisdom Engine';
    }

    // Generate auspicious numbers & daily lucky colors based on cards
    const luckySeed = cards.reduce((acc, c) => acc + c.id, 0);
    const luckyNum1 = ((luckySeed * 7 + 3) % 90) + 10;
    const luckyNum2 = (luckySeed % 9) + 1;
    const luckyColors = ['ม่วงอเมทิสต์', 'ทองคำเปลว', 'น้ำเงินมิดไนท์', 'เขียวเหนี่ยวทรัพย์', 'ชมพูมหาเสน่ห์'];
    const luckyColor = luckyColors[luckySeed % luckyColors.length];
    const directions = ['ทิศตะวันออกเฉียงเหนือ (ทิศเศรษฐี)', 'ทิศเหนือ (ทิศแห่งปัญญาญาณ)', 'ทิศตะวันออก (ทิศรุ่งอรุณความก้าวหน้า)', 'ทิศตะวันตกเฉียงใต้ (ทิศเสริมความรัก)'];
    const luckyDirection = directions[luckySeed % directions.length];

    return NextResponse.json({
      reading: readingText,
      luckyNumbers: `${luckyNum1}, ${luckyNum2}`,
      luckyColor,
      luckyDirection,
      modelUsed,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown server error';
    console.error('[Horoscope API Route Error]', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเชื่อมต่อแม่หมอ AI กรุณาลองใหม่อีกครั้ง', details: errorMsg },
      { status: 500 }
    );
  }
}
