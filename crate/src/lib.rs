#[macro_use]
extern crate lazy_static;
use parking_lot::Mutex;
mod soundchip;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Init the mutex has SoundChip instance
lazy_static! {
    static ref SOUNDCHIP: Mutex<soundchip::SoundChip> =
        Mutex::new(soundchip::SoundChip::new());
}

// exporting function
#[no_mangle]
pub extern "C" fn buffer_alloc(size: usize) -> *mut f32 {
    let mut buffer = Vec::<f32>::with_capacity(size);
    let ptr = buffer.as_mut_ptr();
    std::mem::forget(buffer);
    return ptr as *mut f32
}

// exporting function
#[no_mangle]
pub extern "C" fn process(out_ptr: *mut f32, sample_count: u32) {
    let mut soundchip = SOUNDCHIP.lock();
    soundchip.process(out_ptr, sample_count);
}
