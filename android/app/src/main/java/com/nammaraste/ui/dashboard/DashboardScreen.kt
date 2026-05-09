package com.nammaraste.reporter.ui.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AccountCircle

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(onNavigateToReport: () -> Unit) {
    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNavigateToReport,
                containerColor = Color(0xFF1E3A8A),
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Report Issue")
            }
        },
        topBar = {
            TopAppBar(
                title = { Text("Namma-Raste", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = {}) {
                        Icon(Icons.Default.AccountCircle, contentDescription = "Profile")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            item {
                WelcomeCard()
                Spacer(modifier = Modifier.height(24.dp))
                ImpactStats()
                Spacer(modifier = Modifier.height(24.dp))
                NearbyAlertsHeader()
            }
        }
    }
}

@Composable
fun WelcomeCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E3A8A))
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text("Hello, Civic Hero!", color = Color.White.copy(alpha = 0.7f), fontSize = 14.sp)
            Text("Make your neighborhood safer today.", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun ImpactStats() {
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
        StatItem(label = "Resolved", value = "12", modifier = Modifier.weight(1f))
        StatItem(label = "Points", value = "450", modifier = Modifier.weight(1f))
    }
}

@Composable
fun StatItem(label: String, value: String, modifier: Modifier = Modifier) {
    Card(modifier = modifier) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(value, fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text(label.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
        }
    }
}
