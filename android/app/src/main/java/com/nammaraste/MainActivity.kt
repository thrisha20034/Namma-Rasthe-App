package com.nammaraste.reporter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.nammaraste.reporter.ui.theme.NammaRasteTheme
import com.nammaraste.reporter.ui.dashboard.DashboardScreen
import com.nammaraste.reporter.ui.report.ReportScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NammaRasteTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NammaRasteApp()
                }
            }
        }
    }
}

@Composable
fun NammaRasteApp() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "dashboard") {
        composable("dashboard") { DashboardScreen(onNavigateToReport = { navController.navigate("report") }) }
        composable("report") { ReportScreen(onBack = { navController.popBackStack() }) }
    }
}
