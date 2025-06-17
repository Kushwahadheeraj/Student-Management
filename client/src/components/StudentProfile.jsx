import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Menu, 
  TrendingUp, 
  Calendar, 
  Target, 
  BarChart3,
  Activity,
  Clock,
  Trophy,
  Zap,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

function StudentProfile({ student, onBack, sidebarOpen, onToggleSidebar }) {
  const [contestFilter, setContestFilter] = useState("30");
  const [problemFilter, setProblemFilter] = useState("30");

  // Mock contest history data
  const contestHistory = [
    {
      id: 1,
      name: "Codeforces Round #123",
      date: "2024-01-20",
      rank: 45,
      ratingChange: +25,
      problemsSolved: 3,
      totalProblems: 5,
      newRating: 1475
    },
    {
      id: 2,
      name: "Codeforces Round #122",
      date: "2024-01-18",
      rank: 67,
      ratingChange: -15,
      problemsSolved: 2,
      totalProblems: 5,
      newRating: 1450
    },
    {
      id: 3,
      name: "Codeforces Round #121",
      date: "2024-01-15",
      rank: 23,
      ratingChange: +50,
      problemsSolved: 4,
      totalProblems: 5,
      newRating: 1465
    }
  ];

  // Mock problem solving data
  const problemSolvingData = {
    totalProblemsSolved: 156,
    averageRating: 1350,
    averageProblemsPerDay: 2.3,
    mostDifficultProblem: {
      name: "Problem D - Complex Algorithm",
      rating: 1800,
      contest: "Codeforces Round #120"
    },
    ratingDistribution: [
      { range: "800-1000", count: 25 },
      { range: "1000-1200", count: 45 },
      { range: "1200-1400", count: 35 },
      { range: "1400-1600", count: 28 },
      { range: "1600-1800", count: 15 },
      { range: "1800+", count: 8 }
    ]
  };

  const getRatingColor = (rating) => {
    if (rating >= 2400) return "text-red-600";
    if (rating >= 2100) return "text-orange-600";
    if (rating >= 1900) return "text-purple-600";
    if (rating >= 1600) return "text-blue-600";
    if (rating >= 1400) return "text-cyan-600";
    if (rating >= 1200) return "text-green-600";
    return "text-gray-600";
  };

  const getRatingChangeColor = (change) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getRankBadge = (rank) => {
    if (rank <= 10) return <Badge className="bg-yellow-100 text-yellow-800">Top 10</Badge>;
    if (rank <= 50) return <Badge className="bg-blue-100 text-blue-800">Top 50</Badge>;
    if (rank <= 100) return <Badge className="bg-green-100 text-green-800">Top 100</Badge>;
    return <Badge variant="secondary">{rank}</Badge>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={onToggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Student Profile</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Students
              </Button>
            </div>
            
            {/* Student Info Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h1>
                      <p className="text-gray-600">{student.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                        <span className="text-sm text-gray-500">• {student.course}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getRatingColor(student.currentRating)}`}>
                        {student.currentRating}
                      </div>
                      <div className="text-sm text-gray-500">Current Rating</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getRatingColor(student.maxRating)}`}>
                        {student.maxRating}
                      </div>
                      <div className="text-sm text-gray-500">Max Rating</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => window.open(`https://codeforces.com/profile/${student.codeforcesHandle}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on CF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="contests" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contests" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Contest History
                </TabsTrigger>
                <TabsTrigger value="problems" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Problem Solving
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contests" className="space-y-6">
                {/* Contest Filter */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Filter by:</span>
                  <Select value={contestFilter} onValueChange={setContestFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last 365 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Graph Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Rating Progress
                    </CardTitle>
                    <CardDescription>
                      Rating changes over the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Rating graph will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contest List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Contests</CardTitle>
                    <CardDescription>
                      Contest performance in the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contestHistory.map((contest) => (
                        <div key={contest.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{contest.name}</h3>
                              {getRankBadge(contest.rank)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{contest.date}</span>
                              <span>Problems: {contest.problemsSolved}/{contest.totalProblems}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getRatingChangeColor(contest.ratingChange)}`}>
                              {contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
                            </div>
                            <div className="text-sm text-gray-500">
                              → {contest.newRating}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="problems" className="space-y-6">
                {/* Problem Filter */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Filter by:</span>
                  <Select value={problemFilter} onValueChange={setProblemFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Problem Solving Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
                      <Target className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{problemSolvingData.totalProblemsSolved}</div>
                      <p className="text-xs text-muted-foreground">Solved in selected period</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                      <BarChart3 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{problemSolvingData.averageRating}</div>
                      <p className="text-xs text-muted-foreground">Of solved problems</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Problems/Day</CardTitle>
                      <Activity className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{problemSolvingData.averageProblemsPerDay}</div>
                      <p className="text-xs text-muted-foreground">Average daily activity</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Hardest Problem</CardTitle>
                      <Zap className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getRatingColor(problemSolvingData.mostDifficultProblem.rating)}`}>
                        {problemSolvingData.mostDifficultProblem.rating}
                      </div>
                      <p className="text-xs text-muted-foreground">Rating achieved</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Rating Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Problems by Rating</CardTitle>
                    <CardDescription>
                      Distribution of solved problems across rating ranges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {problemSolvingData.ratingDistribution.map((item) => (
                        <div key={item.range} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium">{item.range}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-blue-600 h-4 rounded-full"
                              style={{ width: `${(item.count / problemSolvingData.totalProblemsSolved) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-sm text-gray-600">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Submission Heatmap Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Heatmap</CardTitle>
                    <CardDescription>
                      Daily submission activity over the past year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Submission heatmap will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile; 