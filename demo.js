function isRotation(str1, str2) 
    { 
        var n = str1.length(); 
        var m = str2.length(); 
        if (n != m) 
            return false; 
  
        // create lps[] that will hold the longest 
        // prefix suffix values for pattern 
        var lps = []; 
  
        // length of the previous longest prefix suffix 
        var len = 0; 
        var i = 1; 
        lps[0] = 0; // lps[0] is always 0 
  
        // the loop calculates lps[i] for i = 1 to n-1 
        while (i < n) { 
            if (str1.charAt(i) == str2.charAt(len)) { 
                lps[i] = ++len; 
                ++i; 
            } 
            else { 
                if (len == 0) { 
                    lps[i] = 0; 
                    ++i; 
                } 
                else { 
                    len = lps[len - 1]; 
                } 
            } 
        } 
  
        i = 0; 
  
        // match from that rotating point 
        for (let k = lps[n - 1]; k < m; ++k) { 
            if (str2.charAt(k) != str1.charAt(i++)) 
                return false; 
        } 
        return true; 
    } 