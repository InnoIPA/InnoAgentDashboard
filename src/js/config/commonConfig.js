/**
 * Configure instructions.
 * 
 * Step 1. Specify the web service version.
 * 
 * 
 * Step 2. Specify the web service address.
 * 
 * 
 * */

/*
 * serviceAddress (string)
 * If the server is hosting on public cloud, the variable serverAddress must be given its value.
 * 
 */
// Example: serviceAddress = "http://{your domain name}:8162";
export const serviceAddress = "";

export const demoWebTitle = "InnoAgent OOB Demo";

export const checkOnlineStatusFreq = parseInt(process.env.CHECK_SPHERE_STATUS_FREQ) || 86000; // msec