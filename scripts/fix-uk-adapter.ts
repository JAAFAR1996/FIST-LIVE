import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const sql = neon(process.env.DATABASE_URL!);

async function fixUKAdapter() {
  const newThumbnail = '/images/products/yee/uk-plug-adapter/main.png';
  const newImages = ['/images/products/yee/uk-plug-adapter/main.png'];

  const result = await sql`
    UPDATE products 
    SET 
      thumbnail = ${newThumbnail},
      images = ${JSON.stringify(newImages)}::jsonb,
      updated_at = NOW()
    WHERE id = 'yee-uk-plug-adapter'
    RETURNING id, name
  `;

  console.log('✓ تم تحديث محول UK بالصورة الجديدة:', result);
}

fixUKAdapter().catch(console.error);
