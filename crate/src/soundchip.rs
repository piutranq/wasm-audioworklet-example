const SAMPLE_BUFSIZE: usize = 128;

// Sound chip example. it generates GB style white noise.
pub struct SoundChip {
    tap_b: u8,
    register: u16
}

impl SoundChip {
    pub fn new() -> SoundChip {
        SoundChip {
            tap_b: 1_u8,
            register: 1_u16
        }
    }
    pub fn process(&mut self, out_ptr: *mut f32, _sample_count: u32) {
        // borrow output buffer from out_ptr pointer.
        let out_buf: &mut [f32] = unsafe {
            std::slice::from_raw_parts_mut(out_ptr, SAMPLE_BUFSIZE)
        };

        for i in 0..SAMPLE_BUFSIZE {
            self.clock();

            // Generate hex value and convert to f32 sample
            let hex = self.hex() as f32;
            let gain = 0.25_f32;
            let sample = ((hex / 7.5) - 1.0) * gain;

            // fill f32 sample to output buffer
            out_buf[i] = sample;
        };
    }

    // clock the LFSR
    fn clock(&mut self) {
        let bit_a = self.register & 1;
        let bit_b = (self.register >> self.tap_b) & 1;
        let feedback = (bit_a ^ bit_b) << 14;
        self.register >>=1;
        self.register |= feedback;
    }

    // Get current hex value of LFSR
    fn hex(&self) -> u8 { (self.register & 0xF) as u8 }
}