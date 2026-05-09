package com.nammaraste.reporter.ui.report

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportScreen(onBack: () -> Unit) {
    var isAnalyzing by remember { mutableStateOf(false) }
    var reportSubmitted by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Submit Report", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Camera Preview Placeholder
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Black)
            ) {
                Box(contentAlignment = androidx.compose.ui.Alignment.Center, modifier = Modifier.fillMaxSize()) {
                    Text("Real-time CameraX Preview", color = Color.White.copy(alpha = 0.5f))
                }
            }

            Text(
                "Capture a clear photo of the infrastructure issue. Our AI will analyze it automatically.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = { 
                    isAnalyzing = true
                    // In a real app, this would trigger CameraX capture & Gemini API
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E3A8A)),
                shape = MaterialTheme.shapes.large
            ) {
                if (isAnalyzing) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("Capture & Analyze", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
    
    if (isAnalyzing) {
        // Mocking completion after 2 seconds
        LaunchedEffect(Unit) {
            kotlinx.coroutines.delay(2000)
            isAnalyzing = false
            reportSubmitted = true
        }
    }

    if (reportSubmitted) {
        AlertDialog(
            onDismissRequest = { onBack() },
            title = { Text("Report Submitted") },
            text = { Text("Issue classified as 'Pothole' with High Severity. Ticket ID: TRA-89210") },
            confirmButton = {
                TextButton(onClick = { onBack() }) {
                    Text("OK")
                }
            }
        )
    }
}
