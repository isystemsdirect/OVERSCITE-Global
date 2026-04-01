import dgram from 'node:dgram';

export type UtcSyncStatus = {
  utc: string; // ISO string
  offsetMs: number;
  synchronized: boolean;
};

/**
 * getCurrentUTC queries an external secure NTP source (time.google.com)
 * over UDP to determine local clock drift and return verified UTC time.
 */
export async function getCurrentUTC(timeoutMs = 1500): Promise<UtcSyncStatus> {
  return new Promise((resolve) => {
    let resolved = false;
    const client = dgram.createSocket('udp4');
    
    // Construct minimal SNTP request packet
    const ntpData = Buffer.alloc(48);
    ntpData[0] = 0x1b; // LI=0, VN=3, Mode=3 (Client)

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        client.close();
        resolve({
          utc: new Date().toISOString(),
          offsetMs: 0, 
          synchronized: false // Indicates verification failed, likely strict mode will reject
        });
      }
    }, timeoutMs);

    client.on('message', (msg) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      client.close();

      try {
        // NTP timestamp starts at byte 40 (Transmit Timestamp)
        const seconds = msg.readUInt32BE(40) - 2208988800; // Offset between 1900 clock and 1970 UNIX Epoch
        const fraction = msg.readUInt32BE(44);
        
        const ntpMs = (seconds * 1000) + ((fraction * 1000) / 0x100000000);
        const localMs = Date.now();
        
        resolve({
          utc: new Date(ntpMs).toISOString(),
          offsetMs: Math.abs(ntpMs - localMs),
          synchronized: true,
        });
      } catch (err) {
        resolve({
          utc: new Date().toISOString(),
          offsetMs: 0,
          synchronized: false,
        });
      }
    });

    client.on('error', () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        client.close();
        resolve({
          utc: new Date().toISOString(),
          offsetMs: 0,
          synchronized: false,
        });
      }
    });

    client.send(ntpData, 123, 'time.google.com');
  });
}
