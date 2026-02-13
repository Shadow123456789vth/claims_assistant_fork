import {
  DxcHeading,
  DxcFlex,
  DxcTypography,
  DxcBadge,
  DxcInset,
  DxcChip
} from '@dxc-technology/halstack-react';
import './LossEventPanel.css';

const LossEventPanel = ({ claimData }) => {
  if (!claimData?.lossEvent) {
    return (
      <DxcInset space="2rem">
        <DxcTypography>Loss event data not available</DxcTypography>
      </DxcInset>
    );
  }

  const { lossEvent } = claimData;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeLabel = (eventType) => {
    const labels = {
      winter_storm: 'Winter Storm',
      auto_collision: 'Auto Collision',
      fire: 'Fire',
      theft: 'Theft',
      property_damage: 'Property Damage',
      water_damage: 'Water Damage'
    };
    return labels[eventType] || eventType;
  };

  const getSeverityColor = (level) => {
    switch (level) {
      case 'severe':
      case 'high':
        return 'var(--color-bg-error-lighter)';
      case 'medium':
      case 'moderate':
        return 'var(--color-bg-warning-lighter)';
      default:
        return 'var(--color-bg-info-lighter)';
    }
  };

  return (
    <div className="loss-event-panel">
      <DxcInset space="2rem">
        <DxcFlex direction="column" gap="var(--spacing-gap-l)">

          {/* Header */}
          <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
            <DxcHeading level={3} text="Loss Event Details" />
            <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
              Comprehensive loss event information and incident details
            </DxcTypography>
          </DxcFlex>

          {/* Event Type and Cause */}
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            <div className="info-row">
              <DxcTypography fontWeight="font-weight-semibold">Event Type:</DxcTypography>
              <DxcBadge
                label={getEventTypeLabel(lossEvent.eventType)}
                mode="notification"
                notificationNumber={false}
              />
            </div>

            <div className="info-row">
              <DxcTypography fontWeight="font-weight-semibold">Cause of Loss:</DxcTypography>
              <DxcTypography>{lossEvent.causeOfLoss}</DxcTypography>
            </div>

            <div className="info-row">
              <DxcTypography fontWeight="font-weight-semibold">Loss Date:</DxcTypography>
              <DxcTypography>{formatDate(lossEvent.lossDate)}</DxcTypography>
            </div>

            <div className="info-row">
              <DxcTypography fontWeight="font-weight-semibold">Reported Date:</DxcTypography>
              <DxcTypography>{formatDate(lossEvent.reportedDate)}</DxcTypography>
            </div>
          </DxcFlex>

          {/* Location */}
          {lossEvent.location && (
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcHeading level={4} text="Loss Location" />
              <div className="location-box">
                <DxcTypography fontWeight="font-weight-semibold">{lossEvent.location.address}</DxcTypography>
                <DxcTypography>
                  {lossEvent.location.city}, {lossEvent.location.state} {lossEvent.location.zip}
                </DxcTypography>
              </div>
            </DxcFlex>
          )}

          {/* Weather Data */}
          {lossEvent.weatherData && (
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcHeading level={4} text="Weather Conditions" />
              <div
                className="weather-box"
                style={{ backgroundColor: getSeverityColor(lossEvent.weatherData.alertLevel) }}
              >
                <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                  <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
                    <div className="weather-icon">🌡️</div>
                    <DxcTypography fontWeight="font-weight-semibold" fontSize="font-scale-04">
                      {lossEvent.weatherData.temperature}
                    </DxcTypography>
                  </DxcFlex>
                  <DxcTypography>{lossEvent.weatherData.conditions}</DxcTypography>
                  {lossEvent.weatherData.windSpeed && (
                    <DxcTypography fontSize="font-scale-02">
                      Wind Speed: {lossEvent.weatherData.windSpeed}
                    </DxcTypography>
                  )}
                  <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
                    Source: {lossEvent.weatherData.source}
                  </DxcTypography>
                </DxcFlex>
              </div>
            </DxcFlex>
          )}

          {/* IoT Sensor Data */}
          {lossEvent.iotSensorData && lossEvent.iotSensorData.length > 0 && (
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcHeading level={4} text="IoT Sensor Alerts" />
              <DxcFlex gap="var(--spacing-gap-m)" wrap="wrap">
                {lossEvent.iotSensorData.map((sensor, index) => (
                  <div key={index} className="sensor-card">
                    <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                      <DxcFlex justifyContent="space-between" alignItems="center">
                        <DxcTypography fontWeight="font-weight-semibold" fontSize="font-scale-03">
                          {sensor.type.replace('_', ' ').toUpperCase()}
                        </DxcTypography>
                        <DxcChip
                          label={sensor.status}
                          size="small"
                          color={sensor.status === 'active' ? 'error' : 'info'}
                        />
                      </DxcFlex>
                      <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
                        {sensor.reading}
                      </DxcTypography>
                      <DxcTypography fontSize="font-scale-02" color="#000000">
                        ⚠️ {sensor.alert}
                      </DxcTypography>
                      <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
                        {formatDate(sensor.timestamp)}
                      </DxcTypography>
                      <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
                        Sensor ID: {sensor.sensorId}
                      </DxcTypography>
                    </DxcFlex>
                  </div>
                ))}
              </DxcFlex>
            </DxcFlex>
          )}

        </DxcFlex>
      </DxcInset>
    </div>
  );
};

export default LossEventPanel;
