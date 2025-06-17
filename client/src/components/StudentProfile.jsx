import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChartComponent, BarChartComponent, RatingDistributionChart } from "@/components/ui/chart";
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

  // Mock contest history data with more detailed information
  const contestHistory = [
    {
      id: 1,
      name: "Codeforces Round #123",
      date: "2024-01-20",
      rank: 45,
      ratingChange: +25,
      problemsSolved: 3,
      totalProblems: 5,
      newRating: 1475,
      unsolvedProblems: ["D", "E"],
      contestId: 123
    },
    {
      id: 2,
      name: "Codeforces Round #122",
      date: "2024-01-18",
      rank: 67,
      ratingChange: -15,
      problemsSolved: 2,
      totalProblems: 5,
      newRating: 1450,
      unsolvedProblems: ["C", "D", "E"],
      contestId: 122
    },
    {
      id: 3,
      name: "Codeforces Round #121",
      date: "2024-01-15",
      rank: 23,
      ratingChange: +50,
      problemsSolved: 4,
      totalProblems: 5,
      newRating: 1465,
      unsolvedProblems: ["E"],
      contestId: 121
    },
    {
      id: 4,
      name: "Codeforces Round #120",
      date: "2024-01-12",
      rank: 89,
      ratingChange: -30,
      problemsSolved: 1,
      totalProblems: 5,
      newRating: 1415,
      unsolvedProblems: ["B", "C", "D", "E"],
      contestId: 120
    },
    {
      id: 5,
      name: "Codeforces Round #119",
      date: "2024-01-10",
      rank: 34,
      ratingChange: +35,
      problemsSolved: 3,
      totalProblems: 5,
      newRating: 1445,
      unsolvedProblems: ["D", "E"],
      contestId: 119
    }
  ];

  // Mock problem solving data with more detailed information
  const problemSolvingData = {
    totalProblemsSolved: 156,
    averageRating: 1350,
    averageProblemsPerDay: 2.3,
    mostDifficultProblem: {
      name: "Problem D - Complex Algorithm",
      rating: 1800,
      contest: "Codeforces Round #120",
      date: "2024-01-12"
    },
    ratingDistribution: [
      { range: "800-1000", count: 25 },
      { range: "1000-1200", count: 45 },
      { range: "1200-1400", count: 35 },
      { range: "1400-1600", count: 28 },
      { range: "1600-1800", count: 15 },
      { range: "1800+", count: 8 }
    ],
    dailySubmissions: [
      { date: "2024-01-01", submissions: 5 },
      { date: "2024-01-02", submissions: 3 },
      { date: "2024-01-03", submissions: 7 },
      { date: "2024-01-04", submissions: 2 },
      { date: "2024-01-05", submissions: 6 },
      { date: "2024-01-06", submissions: 4 },
      { date: "2024-01-07", submissions: 8 },
      { date: "2024-01-08", submissions: 1 },
      { date: "2024-01-09", submissions: 5 },
      { date: "2024-01-10", submissions: 9 },
      { date: "2024-01-11", submissions: 3 },
      { date: "2024-01-12", submissions: 6 },
      { date: "2024-01-13", submissions: 2 },
      { date: "2024-01-14", submissions: 4 },
      { date: "2024-01-15", submissions: 7 },
      { date: "2024-01-16", submissions: 5 },
      { date: "2024-01-17", submissions: 3 },
      { date: "2024-01-18", submissions: 8 },
      { date: "2024-01-19", submissions: 4 },
      { date: "2024-01-20", submissions: 6 }
    ]
  };

  // Filter contest history based on selected period
  const filteredContestHistory = useMemo(() => {
    const days = parseInt(contestFilter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return contestHistory.filter(contest => {
      const contestDate = new Date(contest.date);
      return contestDate >= cutoffDate;
    });
  }, [contestFilter]);

  // Filter problem solving data based on selected period
  const filteredProblemData = useMemo(() => {
    const days = parseInt(problemFilter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Filter daily submissions
    const filteredSubmissions = problemSolvingData.dailySubmissions.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= cutoffDate;
    });
    
    // Calculate totals for filtered period
    const totalSubmissions = filteredSubmissions.reduce((sum, day) => sum + day.submissions, 0);
    const averagePerDay = days > 0 ? (totalSubmissions / days).toFixed(1) : 0;
    
    return {
      ...problemSolvingData,
      dailySubmissions: filteredSubmissions,
      totalProblemsSolved: totalSubmissions,
      averageProblemsPerDay: parseFloat(averagePerDay)
    };
  }, [problemFilter]);

  // Prepare rating graph data
  const ratingGraphData = useMemo(() => {
    return filteredContestHistory.map(contest => ({
      date: contest.date,
      rating: contest.newRating,
      change: contest.ratingChange
    }));
  }, [filteredContestHistory]);

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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={onToggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar for Mobile */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between lg:hidden flex-shrink-0">
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
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
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

                {/* Rating Graph */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Rating Progress ({contestFilter} days)
                    </CardTitle>
                    <CardDescription>
                      Rating changes over the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ratingGraphData.length > 0 ? (
                      <LineChartComponent 
                        data={ratingGraphData} 
                        xKey="date" 
                        yKey="rating" 
                        color="#3b82f6"
                      />
                    ) : (
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No contest data available for selected period</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contest List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Contests ({filteredContestHistory.length})</CardTitle>
                    <CardDescription>
                      Contest performance in the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredContestHistory.length > 0 ? (
                        filteredContestHistory.map((contest) => (
                          <div key={contest.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium">{contest.name}</h3>
                                {getRankBadge(contest.rank)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <span>{contest.date}</span>
                                <span>Problems: {contest.problemsSolved}/{contest.totalProblems}</span>
                              </div>
                              {contest.unsolvedProblems.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  Unsolved: {contest.unsolvedProblems.join(", ")}
                                </div>
                              )}
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
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No contests found in the selected period.
                        </div>
                      )}
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
                      <div className="text-2xl font-bold">{filteredProblemData.totalProblemsSolved}</div>
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
                      <div className="text-2xl font-bold">{filteredProblemData.averageProblemsPerDay}</div>
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
                    <RatingDistributionChart data={problemSolvingData.ratingDistribution} />
                  </CardContent>
                </Card>

                {/* Submission Heatmap */}
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Activity ({problemFilter} days)</CardTitle>
                    <CardDescription>
                      Daily submission activity over the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredProblemData.dailySubmissions.length > 0 ? (
                      <BarChartComponent 
                        data={filteredProblemData.dailySubmissions} 
                        xKey="date" 
                        yKey="submissions" 
                        color="#10b981"
                      />
                    ) : (
                      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No submission data available for selected period</p>
                      </div>
                    )}
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