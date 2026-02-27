import AgentActivityPanel from '../components/AgentActivityPanel'
import PipelineFlow from '../components/PipelineFlow'

export default function AgentsPage({ agents }) {
  return <div className="grid"><AgentActivityPanel data={agents} /><PipelineFlow activeStage="Playbook" /></div>
}
