import { createClient } from "@supabase/supabase-js";
import type { Database } from "@complystack/types";

// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to bypass RLS for seeding
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey);

const mockHardware = [
  { brand: "Sunsynk", model_number: "SUN-8K-SG01LP1", kw_capacity: 8, anti_islanding_certified: true },
  { brand: "Sunsynk", model_number: "SUN-5K-SG01LP1", kw_capacity: 5, anti_islanding_certified: true },
  { brand: "Deye", model_number: "SUN-8K-SG01LP1-EU", kw_capacity: 8, anti_islanding_certified: true },
  { brand: "Deye", model_number: "SUN-5K-SG01LP1-EU", kw_capacity: 5, anti_islanding_certified: true },
  { brand: "Growatt", model_number: "MIN 5000TL-X", kw_capacity: 5, anti_islanding_certified: true },
  { brand: "Growatt", model_number: "MIN 6000TL-X", kw_capacity: 6, anti_islanding_certified: true },
  { brand: "Victron", model_number: "MultiPlus-II 48/5000", kw_capacity: 5, anti_islanding_certified: true },
  { brand: "Victron", model_number: "MultiPlus-II 48/8000", kw_capacity: 8, anti_islanding_certified: true },
  { brand: "SMA", model_number: "Sunny Boy 5.0", kw_capacity: 5, anti_islanding_certified: true },
  { brand: "Huawei", model_number: "SUN2000-5KTL-L1", kw_capacity: 5, anti_islanding_certified: true },
  // Adding a non-certified edge case for testing
  { brand: "Generic", model_number: "CHEAP-5K-NON-CERT", kw_capacity: 5, anti_islanding_certified: false },
];

async function seed() {
  console.log("Starting hardware ingestion...");
  
  for (const hw of mockHardware) {
    const { error } = await supabase
      .from("approved_hardware")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(hw as any, { onConflict: "model_number" });
      
    if (error) {
      console.error(`Failed to upsert ${hw.model_number}:`, error.message);
    } else {
      console.log(`Successfully ingested: ${hw.brand} ${hw.model_number}`);
    }
  }
  
  console.log("Hardware ingestion complete.");
}

seed().catch(console.error);
