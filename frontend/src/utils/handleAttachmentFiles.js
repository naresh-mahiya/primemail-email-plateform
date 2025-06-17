import toast from "react-hot-toast";

export const handleAttachmentFiles = ({ newFiles, existingFiles, maxFiles = 10, maxSizeMB = 50 }) => {
    const MAX_SIZE = maxSizeMB * 1024 * 1024;
    const allowedExt = ['.jpg', '.jpeg', '.png', '.pdf', '.docx', '.mp4', '.mov', '.webm', '.avi'];
  
    let files = [...newFiles];
    let current = [...existingFiles];
  
    // Filter invalid types
    const invalid = files.filter(f => !allowedExt.some(ext => f.name.toLowerCase().endsWith(ext)));
    if (invalid.length) {
      toast.error(`Unsupported file(s): ${invalid.map(f => f.name).join(', ')}`);
      files = files.filter(f => !invalid.includes(f));
    }
  
    // Filter oversized
    const oversize = files.filter(f => f.size > MAX_SIZE);
    if (oversize.length) {
      toast.error(`File(s) > ${maxSizeMB}MB: ${oversize.map(f => f.name).join(', ')}`);
      files = files.filter(f => f.size <= MAX_SIZE);
    }
  
    // Merge without duplicates
    for (let file of files) {
      if (!current.some(existing => existing.name === file.name)) {
        current.push(file);
      }
    }
  
    // Enforce max limit
    if (current.length > maxFiles) {
      toast.error(`Only ${maxFiles} attachments allowed. Extra files were ignored.`);
      current = current.slice(0, maxFiles);
    }
  
    return current;
  };
  