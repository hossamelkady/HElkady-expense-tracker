package com.helkady.expenses;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Keep the web view below the status bar and above the navigation bar,
        // so the header buttons are not covered by system bars.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
