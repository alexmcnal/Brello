# Brello Helm Chart

A Helm chart for deploying the Brello Rails application on Kubernetes.

## Overview

This Helm chart deploys a complete Brello application stack including:
- Rails web application with configurable replicas
- PostgreSQL database with persistent storage
- **Database migration job** that runs automatically before deployment
- Kubernetes secrets for sensitive configuration
- Optional ingress for external access
- Optional horizontal pod autoscaling
- Health checks and resource management

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- A container registry with your Brello Docker image

## Installation

### 1. Build and Push Docker Image

```bash
# Build the production image
docker build -t brello:latest .

# Tag for your registry
docker tag brello:latest your-registry/brello:latest

# Push to registry
docker push your-registry/brello:latest
```

### 2. Prepare Configuration

Create a custom values file:

```bash
cp deploy/brello/values.yaml my-values.yaml
```

Edit `my-values.yaml` and update:
- `app.image.repository` - Your Docker registry path
- `app.image.tag` - Your image tag
- `secrets.rails.masterKey` - Your base64 encoded Rails master key
- `app.env.domainName` - Your application domain
- `app.env.notificationEmailsSender` - Your email sender

To generate base64 encoded Rails master key:
```bash
echo -n "your-rails-master-key" | base64
```

### 3. Install the Chart

```bash
# Install with default values
helm install brello deploy/brello/

# Or install with custom values
helm install brello deploy/brello/ -f my-values.yaml

# Install in a specific namespace
helm install brello deploy/brello/ -f my-values.yaml --create-namespace --namespace brello
```

### 4. Verify Deployment

```bash
# Check the status
helm status brello

# Watch pods come up
kubectl get pods -l app.kubernetes.io/instance=brello --watch

# Check services
kubectl get services -l app.kubernetes.io/instance=brello
```

## Configuration

### Core Application Settings

| Parameter | Description | Default |
|-----------|-------------|---------|
| `app.replicaCount` | Number of web application replicas | `2` |
| `app.image.repository` | Docker image repository | `brello` |
| `app.image.tag` | Docker image tag | `latest` |
| `app.image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `app.service.type` | Service type | `LoadBalancer` |
| `app.service.port` | Service port | `80` |

### Environment Variables

| Parameter | Description | Default |
|-----------|-------------|---------|
| `app.env.railsEnv` | Rails environment | `production` |
| `app.env.applicationName` | Application name | `Brello` |
| `app.env.domainName` | Application domain | `brello.example.com` |
| `app.env.notificationEmailsSender` | Email sender address | `notifications@brello.example.com` |

### PostgreSQL Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `postgresql.enabled` | Enable PostgreSQL deployment | `true` |
| `postgresql.image.repository` | PostgreSQL image repository | `postgres` |
| `postgresql.image.tag` | PostgreSQL image tag | `16.3` |
| `postgresql.database.name` | Database name | `brello_production` |
| `postgresql.database.user` | Database user | `postgres` |
| `postgresql.persistence.enabled` | Enable persistent storage | `true` |
| `postgresql.persistence.size` | Storage size | `10Gi` |

### Secrets

| Parameter | Description | Required |
|-----------|-------------|----------|
| `secrets.rails.masterKey` | Base64 encoded Rails master key | **Yes** |
| `secrets.rails.encryptSecretKey` | Base64 encoded encrypt secret key | No |
| `secrets.rails.encryptIv` | Base64 encoded encrypt IV | No |
| `secrets.rails.encryptSalt` | Base64 encoded encrypt salt | No |

### Ingress (Optional)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ingress.enabled` | Enable ingress | `false` |
| `ingress.className` | Ingress class name | `""` |
| `ingress.hosts` | Ingress hosts configuration | See values.yaml |

### Migration Job

| Parameter | Description | Default |
|-----------|-------------|---------|
| `migration.enabled` | Enable database migration job | `true` |
| `migration.commands` | Additional commands to run after migration | `[]` |

### Autoscaling (Optional)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `autoscaling.enabled` | Enable HPA | `false` |
| `autoscaling.minReplicas` | Minimum replicas | `2` |
| `autoscaling.maxReplicas` | Maximum replicas | `10` |
| `autoscaling.targetCPUUtilizationPercentage` | CPU target | `80` |

## Usage Examples

### Basic Installation

```bash
helm install brello deploy/brello/ \
  --set app.image.repository=your-registry/brello \
  --set app.image.tag=v1.0.0 \
  --set secrets.rails.masterKey=eW91ci1lbmNvZGVkLWtleQ== \
  --set app.env.domainName=brello.yourcompany.com
```

### With Ingress

```bash
helm install brello deploy/brello/ -f my-values.yaml \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=brello.yourcompany.com \
  --set app.service.type=ClusterIP
```

### With Autoscaling

```bash
helm install brello deploy/brello/ -f my-values.yaml \
  --set autoscaling.enabled=true \
  --set autoscaling.minReplicas=3 \
  --set autoscaling.maxReplicas=20
```

### With Additional Migration Commands

```bash
helm install brello deploy/brello/ -f my-values.yaml \
  --set migration.commands[0]="bundle exec rails db:seed" \
  --set migration.commands[1]="bundle exec rails db:create_admin_user"
```

### Skip Database Migration

```bash
helm install brello deploy/brello/ -f my-values.yaml \
  --set migration.enabled=false
```

### Using External Database

```bash
helm install brello deploy/brello/ -f my-values.yaml \
  --set postgresql.enabled=false \
  --set app.env.databaseUrl="postgres://user:pass@external-db:5432/brello_production"
```

## Accessing the Application

### LoadBalancer Service

```bash
# Get external IP
kubectl get service brello-web -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Or get hostname (for cloud providers)
kubectl get service brello-web -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

### Port Forward (for local testing)

```bash
kubectl port-forward service/brello-web 3000:80
# Access at http://localhost:3000
```

### Ingress

Configure your DNS to point to the ingress controller and access via your configured hostname.

## Maintenance

### Upgrading

```bash
# Upgrade with new values
helm upgrade brello deploy/brello/ -f my-values.yaml

# Upgrade with new image version
helm upgrade brello deploy/brello/ \
  --set app.image.tag=v1.1.0 \
  --reuse-values
```

### Scaling

```bash
# Scale manually
helm upgrade brello deploy/brello/ \
  --set app.replicaCount=5 \
  --reuse-values

# Or use kubectl
kubectl scale deployment brello-web --replicas=5
```

### Backup Database

```bash
# Exec into PostgreSQL pod
kubectl exec -it deployment/postgres -- pg_dump -U postgres brello_production > backup.sql
```

### View Logs

```bash
# Application logs
kubectl logs -l app=brello-web -f

# Database logs
kubectl logs -l app=postgres -f
```

## Troubleshooting

### Common Issues

1. **Pod stuck in ImagePullBackOff**
   - Check image repository and tag
   - Verify registry authentication

2. **Rails master key missing**
   - Ensure `secrets.rails.masterKey` is set and base64 encoded

3. **Database migration fails**
   - Check migration job logs: `kubectl logs job/brello-web-migration-<revision>`
   - Verify Rails master key is correctly set
   - Check database connectivity

4. **Database connection issues**
   - Check PostgreSQL pod is running
   - Verify database credentials
   - Check network policies

5. **Application not accessible**
   - Verify service type and configuration
   - Check ingress configuration if enabled
   - Verify security groups/firewall rules

### Debug Commands

```bash
# Check all resources
kubectl get all -l app.kubernetes.io/instance=brello

# Check migration job status
kubectl get jobs -l app.kubernetes.io/component=migration
kubectl logs job/brello-web-migration-<revision>

# Describe problematic pods
kubectl describe pod -l app=brello-web

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp

# Check secrets
kubectl get secrets -l app.kubernetes.io/instance=brello
```

## Uninstalling

```bash
# Uninstall the release
helm uninstall brello

# Remove PVCs (if needed)
kubectl delete pvc -l app.kubernetes.io/instance=brello
```

## Security Considerations

- Store sensitive values in a secure location (e.g., HashiCorp Vault, AWS Secrets Manager)
- Use RBAC to restrict access to the namespace
- Enable network policies for pod-to-pod communication
- Regularly update container images for security patches
- Consider using sealed secrets or external secret operators

## Contributing

1. Make changes to templates or values
2. Test with `helm template deploy/brello/`
3. Validate with `helm lint deploy/brello/`
4. Test deployment in a development cluster 